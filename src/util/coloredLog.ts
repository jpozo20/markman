type logType = 'success' | 'info' | 'warning' | 'error';
const colors = {
  success: '\u001b[32m',
  warning: '\u001b[33m',
  error: '\u001b[31m',
  info: '\u001b[34m',
};
export default function colorLog(message: string, logType: logType) {
  const color = colors[logType] ?? '';
  console.log(`${color}${message}`);
}
