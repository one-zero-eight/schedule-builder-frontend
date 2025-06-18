import Card from './ConflictCard';

import { Collisions, ConflictType } from '../../lib/types';
import { useState } from 'react';
import { getAllCollisions } from '../../lib/apis';
import innohassleSvg from "../innohassle.svg"

export default function Main() {
  const currentYear: number = new Date().getFullYear()
  const [ conflicts, setConflicts ] = useState<Collisions>({rooms: [], teachers: []})
  const totalIssues = conflicts.rooms.length + conflicts.teachers.length

  async function getConflicts() {
    setConflicts(await getAllCollisions())
  }

  return (
    <main className="text-center text-white flex flex-col gap-3 h-full">
      <h1>
        InNo<span className="text-innohassle">Hassle</span> SCR
      </h1>
      <p>
        To test the compatibility of a schedule draft, select the required sheet
        from the spreadsheet and click the button below
      </p>
      <button
        className="bg-innohassle text-base py-1 px-6 text-center rounded-full hover:brightness-75"
        onClick={getConflicts}
      >
        Check the scheduling
      </button>

      {totalIssues > 0 && <h3 className="font-semibold">Number of issues: {totalIssues}</h3>}
      <div className="flex flex-col gap-3">
        {conflicts.rooms.map(data => <Card conflictType={ConflictType.roomConflict} lesson={data} />)}
        {conflicts.teachers.map(data => <Card conflictType={ConflictType.teacherConflict} lesson={data} />)}
      </div>

      <footer className="flex flex-col items-center mt-auto select-none">
        <a href="https://innohassle.ru" target='_blank'>
          <img src={innohassleSvg} width={48} height={48} alt="innohassle-logo" />
        </a>
        <p className="mt-2">Schedule conflict resolver</p>
        <p>Project created for <span className="text-innohassle">Software Project 2025</span> course</p>
        <p className="mt-2 text-subtle">Copyright © {currentYear}</p>
      </footer>
    </main>
  );
}
