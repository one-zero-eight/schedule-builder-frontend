export default function Card() {
  return (
    <div className="p-0.5 bg-gradient-to-b from-[#8C35F6] to-[#5C20A6] rounded-lg">
      <div className="p-4 bg-gradient-to-b from-[#323232] to-[#282828] rounded-[calc(0.5rem-1px)]">
        <div className="text-start">
          <p className="text-subtle">Type: Room conflict</p>
          <div className="bg-dark border border-innohassle w-fit text-center p-3 rounded-md *:select-all">
            <p className="text-highlight">Software Project</p>
            <p>CSE-04</p>
            <p className="text-highlight">Mahmoud Naderi</p>
            <p>11:10</p>
          </div>
        </div>
      </div>
    </div>
  );
}
