import NavBar from './navbar';
import Footer from './footer';

export default function Layout({ children }: {
  children: React.ReactNode;
}) {
  return (
      <div className="content">
        <NavBar />
          {children}
        <Footer />
      </div>  
    );
}