const Footer = () => {
  return (
    <footer className="w-full py-12 bg-black flex flex-col items-center justify-center gap-6 mt-16 border-t border-outline-variant/5">
      <span className="text-slate-600 font-bold font-headline tracking-tighter text-xl">
        OS Matchmaker
      </span>
      <div className="flex gap-8">
        <a
          href="#"
          className="text-[10px] font-label text-slate-600 hover:text-indigo-400 uppercase tracking-widest transition-colors"
        >
          Privacy
        </a>
        <a
          href="#"
          className="text-[10px] font-label text-slate-600 hover:text-indigo-400 uppercase tracking-widest transition-colors"
        >
          Terms
        </a>
        <a
          href="#"
          className="text-[10px] font-label text-slate-600 hover:text-indigo-400 uppercase tracking-widest transition-colors"
        >
          API Status
        </a>
      </div>
      <p className="text-[10px] font-label text-slate-500 tracking-[0.2em] uppercase text-center max-w-md leading-loose">
        © 2024 OS Matchmaker. Built for the Open Source community.
        <br />
        Deep Analysis. Infinite Connections.
      </p>
    </footer>
  );
};

export default Footer;
