export default function FutureSelfLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        html::-webkit-scrollbar { display: none; }
        html { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      {children}
    </>
  );
}
