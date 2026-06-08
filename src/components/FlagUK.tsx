export function FlagUK() {
  return (
    <span
      aria-hidden
      className="inline-block align-middle overflow-hidden relative"
      style={{
        width: 18,
        height: 13,
        borderRadius: 2,
        background: '#012169',
        backgroundImage: [
          'linear-gradient(to bottom right, transparent calc(50% - 1px), #C8102E calc(50% - 1px), #C8102E calc(50% + 1px), transparent calc(50% + 1px))',
          'linear-gradient(to top right, transparent calc(50% - 1px), #C8102E calc(50% - 1px), #C8102E calc(50% + 1px), transparent calc(50% + 1px))',
          'linear-gradient(white calc(50% - 1px), white calc(50% + 1px))',
          'linear-gradient(90deg, white calc(50% - 1px), white calc(50% + 1px))'
        ].join(', ')
      }}
    />
  );
}
