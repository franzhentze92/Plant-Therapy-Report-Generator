import React, { useEffect, useState } from 'react';
import ClientReportExport from '../components/ClientReportExport';

const PrintClientReport: React.FC = () => {
  const [reportData, setReportData] = useState<any | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('clientReportData');
    if (data) {
      setReportData(JSON.parse(data));
      setTimeout(() => window.print(), 500); // Give time for render
    }
  }, []);

  if (!reportData) {
    return <div style={{ padding: 40, fontSize: 18 }}>No report data found. Please export a report from the main app.</div>;
  }

  // If paddockReports is present, render all as separate pages
  if (Array.isArray(reportData.paddockReports) && reportData.paddockReports.length > 0) {
    return (
      <div id="client-report">
        {reportData.paddockReports.map((paddock: any, i: number) => (
          <div key={i} style={{ pageBreakBefore: i > 0 ? 'always' : undefined }}>
            <ClientReportExport {...(paddock.data || paddock)} isFirstPage={i === 0} />
          </div>
        ))}
      </div>
    );
  }

  // Fallback: render single report
  return (
    <div id="client-report">
      <ClientReportExport {...reportData} />
    </div>
  );
};

export default PrintClientReport; 