import Card from './ConflictCard';

export default function Main() {
  return (
    <main className="text-center text-white flex flex-col gap-3">
      <h1>
        InNo<span className="text-innohassle">Hassle</span> SCR
      </h1>
      <p>
        To test the compatibility of a schedule draft, select the required sheet
        from the spreadsheet and click the button below
      </p>
      <button className="bg-innohassle text-base py-1 px-6 text-center rounded-full">
        Check the scheduling
      </button>

      <Card />
    </main>
  );
}
