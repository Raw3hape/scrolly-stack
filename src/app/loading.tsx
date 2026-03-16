export default function Loading() {
  return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid var(--border-default)',
        borderTopColor: 'var(--accent-brand)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
    </div>
  );
}
