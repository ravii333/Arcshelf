export function formatToMarkdown({ subject, examType, year, questionsText }) {
  const header = `# ${subject.trim()} – ${examType} – ${year}\n\n`;

  const questionLines = questionsText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map((line) => line.replace(/^[\d\w][\.\)]\s*/, ''))
    .map((line, index) => `${index + 1}. ${line}`)
    .join('\n');

  return header + questionLines;
}