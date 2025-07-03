import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>TaskFlow</h1>
      <nav>
        <ul>
          <li><Link href="/users">Usuários</Link></li>
          <li><Link href="/tasks">Tarefas</Link></li>
        </ul>
      </nav>
    </div>
  );
}
