import { useState } from "react";

import { serverFunctions } from "../../utils/serverFunctions";

export default function Main() {
  const [ counter, setCounter ] = useState(0)

  return <div className="flex flex-col gap-3">
    <p>This is a very simple window that allows to test client-side interactivity and server-side functionality</p>
    <button className="border-2" onClick={() => serverFunctions.fillE2FieldWith(counter.toString()) }>Fill E2 sheet</button>
    <button className="border-2" onClick={() => setCounter(prev => prev + 1)}>Counter: {counter}</button>
  </div>
}
