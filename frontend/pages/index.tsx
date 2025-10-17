import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        maxWidth: '500px'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          fontFamily: "'Playfair Display', serif"
        }}>
          Perspectives
        </h1>
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Manage your tasks with style and intention
        </p>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/signup" style={{
            padding: '0.875rem 2rem',
            backgroundColor: '#FF5844',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(255, 88, 68, 0.4)';
          }} onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}>
            Sign Up
          </Link>
          
          <Link href="/login" style={{
            padding: '0.875rem 2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            border: '2px solid white',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }} onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
