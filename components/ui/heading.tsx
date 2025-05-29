interface HeadingProps {
   title: string;
   description?: string;
};

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
   return (
      <div>
         <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{title}</h1>
         {description && (
         <p style={{ fontSize: '1rem', margin: 0, color: '#555' }}>{description}</p>
         )}
      </div>
   );
};