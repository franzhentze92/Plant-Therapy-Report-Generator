from flask import Flask, request, jsonify
import pdfplumber
import os
import traceback
from pdf2image import convert_from_bytes
import pytesseract
from PIL import Image
from flask_cors import CORS
import re
import difflib
import openai
from dotenv import load_dotenv
load_dotenv()

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
client = openai.OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)
CORS(app)


def extract_tables_with_pdfplumber(file):
    tables = []
    with pdfplumber.open(file) as pdf:
        for page_num, page in enumerate(pdf.pages):
            page_tables = page.extract_tables()
            app.logger.info(
                f'Page {
                    page_num +
                    1}: Found {
                    len(page_tables)} tables')
            for t_idx, table in enumerate(page_tables):
                tables.append(table)
                app.logger.info(
                    f'Table {t_idx + 1} (first 3 rows): {table[:3]}')
    return tables


def extract_text_with_ocr(file):
    images = convert_from_bytes(file.read())
    all_lines = []
    for idx, image in enumerate(images):
        text = pytesseract.image_to_string(image)
        app.logger.info(f'OCR Page {idx +
                                    1} text (first 300 chars): {text[:300]}')
        lines = text.splitlines()
        all_lines.extend(lines)
    return all_lines


def parse_range(val):
    # Extract numbers from a string like "99 - 124 ppm" and return the midpoint
    nums = re.findall(r'\d+\.?\d*', val)
    if len(nums) == 2:
        return (float(nums[0]) + float(nums[1])) / 2
    elif len(nums) == 1:
        return float(nums[0])
    return None


# List of known nutrient names for matching
KNOWN_NUTRIENTS = [
    'Nitrate',
    'Ammonium',
    'Phosphorus',
    'Potassium',
    'Calcium',
    'Magnesium',
    'Sodium',
    'Sulphur',
    'Iron',
    'Copper',
    'Manganese',
    'Boron',
    'Zinc',
    'Cobalt',
    'Molybdenum',
    'Silica',
    'Aluminium',
    'Aluminum',
    'Ca/Mg Ratio',
    'Ca/K',
    'Mg/K',
    'K/Na',
    'P/Zn',
    'Fe/Mn',
    'Organic Matter',
    'Organic Carbon',
    'Conductivity',
    'Paramagnetism',
    'Base Saturation',
    'Other Bases',
    'Silicon',
    'Do (Hot CaCl2)',
    'jum (Mehlich II!)',
    'ium (Mehlich Ill)']

# Expanded custom mapping for common garbled OCR nutrient names
GARBLED_NUTRIENT_MAP = {
    'jum (Mehlich II!)': 'Calcium',
    # Also used for Potassium, will handle below
    'ium (Mehlich Ill)': 'Magnesium',
    'Do (Hot CaCl2)': 'Sodium',
    'Silicon (CaCl2)': 'Silicon',
    '(KCl)': 'Potassium',
    # Add more mappings as needed based on OCR output
}

# Ordered list of expected nutrients (update as needed for your report)
ORDERED_NUTRIENTS = [
    'Calcium', 'Magnesium', 'Potassium', 'Sodium', 'Phosphorus', 'Sulphur',
    'Iron', 'Copper', 'Manganese', 'Boron', 'Zinc', 'Cobalt', 'Molybdenum', 'Silica', 'Aluminium',
    # Add more if your report has more nutrients in a fixed order
]

# Nutrient order and mapping based on the provided soil report image
NUTRIENT_IMAGE_ORDER = [
    'Paramagnetism',
    'pH-level (1:5 water)',
    'Organic Matter (Calc)',
    'Organic Carbon (LECO)',
    'Conductivity (1:5 water)',
    'Ca/Mg Ratio',
    'Nitrate-N (KCl)',
    'Ammonium-N (KCl)',
    'Phosphorus (Mehlich III)',
    'Calcium (Mehlich III)',
    'Magnesium (Mehlich III)',
    'Potassium (Mehlich III)',
    'Sodium (Mehlich III)',
    'Sulfur (KCl)',
    'Aluminium',
    'Silicon (CaCl2)',
    'Boron (Hot CaCl2)',
    'Iron (DTPA)',
    'Manganese (DTPA)',
    'Copper (DTPA)',
    'Zinc (DTPA)'
]


def extract_nutrients_from_text(text):
    import re
    # Only include lines that start with a valid nutrient code (strict match)
    nutrient_prefixes = [
        'N -', 'P -', 'K -', 'S -', 'Ca -', 'Mg -', 'Na -', 'Cu -', 'Zn -',
        'Mn -', 'Fe -', 'B -', 'Mo -', 'Si -', 'Co -'
    ]
    # Build a regex pattern for valid nutrient lines
    prefix_pattern = r'^(N|P|K|S|Ca|Mg|Na|Cu|Zn|Mn|Fe|B|Mo|Si|Co)\s-\s'
    lines = text.split('\n')
    nutrient_lines = []
    for line in lines:
        if re.match(prefix_pattern, line.strip()):
            nutrient_lines.append(line)
    print('DEBUG: Lines considered as nutrients:')
    for l in nutrient_lines:
        print(f'  {l}')
    nutrients = []
    for line in nutrient_lines:
        # Match pattern: "N - Nitrogen 1.61 % 3.5 - 5.5 %"
        match = re.match(
            r'([A-Za-z\s-]+)\s+([<\d\.]+)\s*(ppm|%)?\s*([\d\.\s-]+|N/A)?', line)
        if match:
            name = match.group(1).strip()
            # Only accept if name starts with a valid prefix
            if not any(name.startswith(prefix)
                       for prefix in nutrient_prefixes):
                continue
            current = match.group(2)
            unit = match.group(3) or ('%' if '%' in line else 'ppm')
            ideal_range = match.group(4)
            # Parse ideal range to get midpoint
            ideal = None
            if ideal_range and ideal_range != 'N/A':
                range_match = re.search(
                    r'(\d+\.?\d*)\s*-\s*(\d+\.?\d*)', ideal_range)
                if range_match:
                    low = float(range_match.group(1))
                    high = float(range_match.group(2))
                    ideal = (low + high) / 2
            # Handle '<' values
            if current.startswith('<'):
                current = '0'
            current_val = float(current) if current != '0' else 0
            nutrient_data = {
                'name': name,
                'current': current_val,
                'ideal': ideal,
                'unit': unit
            }
            nutrients.append(nutrient_data)
    return nutrients


@app.route('/extract-soil-report', methods=['POST'])
def extract_soil_report():
    try:
        if 'file' not in request.files:
            app.logger.error('No file uploaded')
            return jsonify({'error': 'No file uploaded'}), 400
        file = request.files['file']
        app.logger.info(f'Received file: {file.filename}')
        file.seek(0)
        tables = extract_tables_with_pdfplumber(file)
        app.logger.info(f'Extracted {len(tables)} tables from PDF')
        for idx, table in enumerate(tables):
            app.logger.info(f'Table {idx + 1} content: {table}')
        file.seek(0)
        
        # Store all found analyses
        all_analyses = []
        analysis_id = 0
        
        # Try to extract nutrients from tables (text-based PDF)
        if tables:
            for table_idx, table in enumerate(tables):
                if not table or len(table) < 2:
                    continue
                    
                # Find header row and map columns
                header_row = None
                header_idx = 0
                for i, row in enumerate(table):
                    if any(cell and isinstance(cell, str)
                           and 'ELEMENT' in cell.upper() for cell in row):
                        header_row = row
                        header_idx = i
                        break
                        
                if header_row:
                    header_map = {}
                    for idx, cell in enumerate(header_row):
                        if not cell:
                            continue
                        cell_l = cell.strip().lower()
                        if 'element' in cell_l or 'category' in cell_l:
                            header_map['name'] = idx
                        elif 'your level' in cell_l or 'level' in cell_l:
                            header_map['current'] = idx
                        elif 'acceptable range' in cell_l or 'range' in cell_l:
                            header_map['ideal'] = idx
                        elif 'unit' in cell_l:
                            header_map['unit'] = idx
                            
                    app.logger.info(f'Detected header row: {header_row}')
                    app.logger.info(f'Header mapping: {header_map}')
                    
                    # Parse data rows
                    nutrients = []
                    for row in table[header_idx + 1:]:
                        if not row or len(row) < 2:
                            continue
                        # Extract the range string as shown in the PDF
                        range_str = row[header_map['ideal']].strip(
                        ) if 'ideal' in header_map and row[header_map['ideal']] else None
                        # Parse the value as before

                        def parse_value(val):
                            if not val:
                                return 0
                            val_clean = re.sub(
                                r'\s*(ppm|%|mg/kg|mS/cm)', '', val)
                            if '<' in val_clean:
                                return 0
                            # Extract the first number from the string
                            match = re.search(r'[-+]?\d*\.\d+|\d+', val_clean)
                            if match:
                                return float(match.group())
                            return 0
                        current = parse_value(
                            row[header_map['current']]) if 'current' in header_map else None
                        # For compatibility, keep 'ideal' as the midpoint if
                        # possible
                        ideal = None
                        if range_str and '-' in range_str:
                            try:
                                parts = [float(re.sub(r'[^0-9.]+', '', p))
                                         for p in range_str.split('-')]
                                if len(parts) == 2:
                                    ideal = sum(parts) / 2
                            except Exception:
                                ideal = None
                        nutrient_row = {
                            'name': row[header_map['name']].strip() if 'name' in header_map and row[header_map['name']] else '',
                            'current': current,
                            'ideal': ideal,
                            'unit': '',
                            'range': range_str
                        }
                        # Try to extract unit from current value
                        if row[header_map['current']
                               ] and '%' in row[header_map['current']]:
                            nutrient_row['unit'] = '%'
                        elif row[header_map['current']] and 'ppm' in row[header_map['current']]:
                            nutrient_row['unit'] = 'ppm'
                        nutrients.append(nutrient_row)
                        
                    # If we found valid nutrients, add this as an analysis
                    if nutrients:
                        # Try to extract analysis info from the table
                        analysis_info = extract_analysis_info(tables, table_idx)
                        all_analyses.append({
                            'id': analysis_id,
                            'nutrients': nutrients,
                            'info': analysis_info
                        })
                        analysis_id += 1
                        
                else:
                    # Fallback: try to extract from all rows with at least 2
                    # columns
                    app.logger.warning(
                        'No header row detected, using fallback extraction for this table.')
                    nutrients = []
                    for row in table:
                        if not row or len(row) < 2:
                            continue
                        name = row[0].strip() if row[0] else ''
                        current_raw = row[1].strip() if row[1] else ''
                        ideal_raw = row[2].strip() if len(
                            row) > 2 and row[2] else ''
                        # Skip empty names and header rows
                        if not name or 'ELEMENT' in name or 'CATEGORY' in name:
                            continue
                        unit = ''
                        if 'ppm' in current_raw or 'ppm' in ideal_raw:
                            unit = 'ppm'
                        elif '%' in current_raw or '%' in ideal_raw:
                            unit = '%'

                        def parse_value(val):
                            if not val:
                                return 0
                            # Remove unit from value
                            val_clean = re.sub(
                                r'\s*(ppm|%|mg/kg|mS/cm)', '', val)
                            if '<' in val_clean:
                                return 0
                            # Extract the first number from the string
                            match = re.search(r'[-+]?\d*\.\d+|\d+', val_clean)
                            if match:
                                return float(match.group())
                            return 0
                        current = parse_value(current_raw)
                        ideal = parse_range(ideal_raw)
                        # Only add if we have a valid name and some data
                        if name and (current > 0 or ideal is not None):
                            nutrient_row = {
                                'name': name,
                                'current': current,
                                'ideal': ideal,
                                'unit': unit
                            }
                            app.logger.info(
                                f'Fallback parsed nutrient row: {nutrient_row}')
                            nutrients.append(nutrient_row)
                            
                    # If we found valid nutrients, add this as an analysis
                    if nutrients:
                        analysis_info = extract_analysis_info(tables, table_idx)
                        all_analyses.append({
                            'id': analysis_id,
                            'nutrients': nutrients,
                            'info': analysis_info
                        })
                        analysis_id += 1

        # If no tables found, try OCR
        if not all_analyses:
            app.logger.warning('No tables found with pdfplumber, trying OCR...')
            file.seek(0)
            ocr_lines = extract_text_with_ocr(file)
            app.logger.info(
                "Original OCR lines for debug:\n" +
                "\n".join(ocr_lines))
            ocr_text = '\n'.join(ocr_lines)
            nutrients_by_image_order = extract_nutrients_from_text(ocr_text)
            if nutrients_by_image_order:
                app.logger.info(
                    f'Final nutrients array (by image order): {nutrients_by_image_order}')
                all_analyses.append({
                    'id': 0,
                    'nutrients': nutrients_by_image_order,
                    'info': {'name': 'OCR Analysis', 'page': 1}
                })

        # Return all analyses found
        if all_analyses:
            app.logger.info(f'Found {len(all_analyses)} analyses in PDF')
            return jsonify({
                'analyses': all_analyses,
                'count': len(all_analyses)
            })

        app.logger.warning(
            'No nutrients extracted from PDF (neither tables nor OCR).')
        return jsonify(
            {'error': 'No nutrients extracted from PDF (neither tables nor OCR).'}), 400
    except Exception as e:
        app.logger.error('Exception during PDF extraction: ' + str(e))
        traceback.print_exc()
        return jsonify(
            {'error': 'Exception during PDF extraction', 'details': str(e)}), 500


def extract_analysis_info(tables, table_idx):
    """Extract analysis information from all tables up to and including the current one (to catch header metadata)"""
    import re
    from datetime import datetime
    info = {
        'name': f'Analysis {table_idx + 1}',
        'page': table_idx + 1,
        'crop': 'Unknown',
        'location': 'Unknown',
        'date': 'Unknown',
        'paddock': 'Unknown'
    }
    date_pattern = re.compile(r"\d{2}/\d{2}/\d{4}")
    
    # First, try to extract from the table immediately before the nutrient table
    if table_idx > 0:
        prev_table = tables[table_idx - 1]
        if 2 <= len(prev_table) <= 4:
            rows = [row[0] if row and isinstance(row[0], str) else '' for row in prev_table]
            rows = [r.strip() for r in rows if r and r.strip()]
            if len(rows) >= 2:
                # First row: crop
                if not date_pattern.match(rows[0]):
                    info['crop'] = rows[0]
                # Second row: paddock (if not a date and not a known crop)
                if len(rows) > 1:
                    if not date_pattern.match(rows[1]) and rows[1] != info['crop']:
                        info['paddock'] = rows[1]
                        print(f"Extracted paddock (immediate): {info['paddock']} from table {table_idx - 1}")
                # Third row: date
                if len(rows) > 2:
                    if date_pattern.match(rows[2]):
                        info['date'] = rows[2]
    
    # Scan all tables from the start up to and including the current table for any missing info
    for idx in range(0, table_idx + 1):
        if idx < 0 or idx >= len(tables):
            continue
        table = tables[idx]
        # Heuristic: If table has 2-4 rows, try to extract missing info
        if 2 <= len(table) <= 4:
            rows = [row[0] if row and isinstance(row[0], str) else '' for row in table]
            rows = [r.strip() for r in rows if r and r.strip()]
            if len(rows) >= 2:
                # First row: crop (if not already found)
                if info['crop'] == 'Unknown' and not date_pattern.match(rows[0]):
                    info['crop'] = rows[0]
                # Second row: paddock (if not already found and not a date and not a known crop)
                if info['paddock'] == 'Unknown' and len(rows) > 1:
                    if not date_pattern.match(rows[1]) and rows[1] != info['crop']:
                        info['paddock'] = rows[1]
                        print(f"Extracted paddock (heuristic): {info['paddock']} from table {idx}")
                # Third row: date (if not already found)
                if info['date'] == 'Unknown' and len(rows) > 2:
                    if date_pattern.match(rows[2]):
                        info['date'] = rows[2]
        # Also check for explicit PADDOCK: lines as fallback
        for row in table:
            if not row:
                continue
            row_text = ' '.join([str(cell) for cell in row if cell])
            paddock_match = re.search(r"PADDOCK:?\s*([\w\-\s]+)", row_text, re.IGNORECASE)
            if paddock_match:
                paddock_val = paddock_match.group(1).strip()
                if paddock_val:
                    info['paddock'] = paddock_val
                    print(f"Extracted paddock (explicit): {info['paddock']} from row: {row_text}")
            # Crop
            if info['crop'] == 'Unknown':
                crop_match = re.search(r"CROP:?\s*([\w\-\s]+)", row_text, re.IGNORECASE)
                if crop_match:
                    crop_val = crop_match.group(1).strip()
                    if crop_val:
                        info['crop'] = crop_val
            # Date
            if info['date'] == 'Unknown':
                date_match = date_pattern.search(row_text)
                if date_match:
                    info['date'] = date_match.group(0)
            # Location
            if info['location'] == 'Unknown':
                loc_match = re.search(r"LOCATION:?\s*([\w\-\s]+)", row_text, re.IGNORECASE)
                if loc_match:
                    loc_val = loc_match.group(1).strip()
                    if loc_val:
                        info['location'] = loc_val
    print(f"Final extracted info for analysis {table_idx + 1}: {info}")
    return info


@app.route('/generate-comments', methods=['POST'])
def generate_comments():
    try:
        data = request.get_json()
        deficient = data.get('deficient', [])
        optimal = data.get('optimal', [])
        excess = data.get('excess', [])

        # Enhanced prompt for more detailed and professional response
        prompt = f"""
As a professional plant nutritionist and agronomist, provide a BRIEF executive summary for a Plant Therapy Report based on the following nutrient analysis:

DEFICIENT NUTRIENTS: {', '.join(deficient) if deficient else 'None'}
OPTIMAL NUTRIENTS: {', '.join(optimal) if optimal else 'None'}
EXCESS NUTRIENTS: {', '.join(excess) if excess else 'None'}

Provide a complete executive summary (2-3 sentences) that gives a brief overview of the plant's nutritional status. Make sure to complete your thoughts and provide a full summary. Do NOT include detailed nutrient descriptions, specific functions, or management recommendations. Keep it brief and professional.

IMPORTANT: When mentioning nutrients, use the format "**Full Name (Abbreviation)**" - for example: **Nitrogen (N)**, **Phosphorus (P)**, **Calcium (Ca)**, **Magnesium (Mg)**, **Potassium (K)**, **Boron (B)**, **Copper (Cu)**, **Zinc (Zn)**, **Iron (Fe)**, **Manganese (Mn)**, **Molybdenum (Mo)**, **Sulphur (S)**, **Sodium (Na)**.

Focus on:
- Brief overview of nutritional status
- Professional tone
- Complete sentences and thoughts
- No detailed nutrient analysis
- Use bold formatting for nutrient names
"""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7
        )
        summary = response.choices[0].message.content.strip()

        # Remove any detailed nutrient descriptions that might still be generated
        import re
        # Remove any text that contains detailed nutrient descriptions
        cleaned = re.sub(r"(Nitrogen is essential for.*?)(?=\n\n|\n[A-Z]|$)", "", summary, flags=re.DOTALL)
        cleaned = re.sub(r"(Phosphorus is necessary for.*?)(?=\n\n|\n[A-Z]|$)", "", cleaned, flags=re.DOTALL)
        cleaned = re.sub(r"(Calcium is vital for.*?)(?=\n\n|\n[A-Z]|$)", "", cleaned, flags=re.DOTALL)
        cleaned = re.sub(r"(Magnesium is a key component.*?)(?=\n\n|\n[A-Z]|$)", "", cleaned, flags=re.DOTALL)
        cleaned = re.sub(r"(Copper, Zinc, Iron, and Boron.*?)(?=\n\n|\n[A-Z]|$)", "", cleaned, flags=re.DOTALL)
        cleaned = re.sub(r"(The excess of.*?)(?=\n\n|\n[A-Z]|$)", "", cleaned, flags=re.DOTALL)
        cleaned = re.sub(r"(To address these deficiencies.*?)(?=\n\n|\n[A-Z]|$)", "", cleaned, flags=re.DOTALL)
        cleaned = re.sub(r"(With proper management.*?)(?=\n\n|\n[A-Z]|$)", "", cleaned, flags=re.DOTALL)
        # Remove any extra blank lines
        cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
        return jsonify({'summary': cleaned.strip()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
