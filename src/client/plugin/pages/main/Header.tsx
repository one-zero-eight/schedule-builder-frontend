import { INNOHASSLE_TOKEN_URL } from '../../../lib/constants';

export default function Header() {
  return (
    <div>
      <h1>
        InNo<span className="text-innohassle">Hassle</span> SCR
      </h1>
      <p>To test the compatibility of the schedule:</p>
      <ol className="list-decimal text-start">
        <li>
          Go to this{' '}
          <a
            target="_blank"
            href={INNOHASSLE_TOKEN_URL}
            rel="noopener noreferer"
            className="text-innohassle"
          >
            website
          </a>{' '}
          and copy the token
        </li>
        <li>Paste the token in the field below</li>
        <li>Press the button "Check the schedule"</li>
      </ol>
    </div>
  );
}
