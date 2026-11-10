import type { ReportData } from './AssessmentReport';

/** Builds the assessment PDF in the browser and downloads it. The PDF engine and fonts load on first use. */
export async function downloadAssessmentReport(d: ReportData, fileName: string) {
  const [{ pdf }, { AssessmentReport }, React] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./AssessmentReport'),
    import('react'),
  ]);
  // AssessmentReport renders a <Document>, which is what pdf() expects.
  const doc = React.createElement(AssessmentReport, { d }) as unknown as Parameters<typeof pdf>[0];
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
