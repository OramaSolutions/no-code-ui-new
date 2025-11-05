// import React from 'react';
// import { FadeLoader, MoonLoader } from 'react-spinners';

// function Loader({item,Visible}) {
//     return (
//       <>
//        {Visible? 
//         <div  style={{ marginLeft: item?item:'400px' }}>
//            <FadeLoader color={'Green'}  size={100} />          
//         </div>:
//         <div className="text-align-end" style={{ marginLeft: item?item:'400px' }}>
//          <MoonLoader color={'Blue'}  size={50} />
//         </div>}
//         </>
//     );
// }

// export default Loader;

import React from 'react';
import { FadeLoader, MoonLoader } from 'react-spinners';

type LoaderVariant = 'fade' | 'moon';

type LoaderProps = {
  // visibility toggle (default: true)
  visible?: boolean;
  // which spinner to use (default: 'fade')
  variant?: LoaderVariant;
  // spinner color, any valid CSS color (default: Tailwind green-600 hex)
  color?: string;
  // spinner size: for FadeLoader this controls height/width/radius approx; for MoonLoader it’s diameter
  size?: number;
  // optional className to position the wrapper
  className?: string;
  // convenience: center the loader with flex utilities
  center?: boolean;
  // optional inline style override
  style?: React.CSSProperties;
};

const Loader: React.FC<LoaderProps> = ({
  visible = true,
  variant = 'fade',
  color = '#16a34a', // Tailwind green-600
  size = 48,
  className = '',
  center = true,
  style,
}) => {
  // Build Tailwind wrapper classes
  const wrapperClasses = [
    'pointer-events-none', // spinner shouldn’t block clicks unless wanted
    center ? 'flex items-center justify-center' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!visible) {
    // Optionally render an alternative loader variant when not visible,
    // but typically return null to hide.
    return null;
  }

  return (
    <div className={wrapperClasses} style={style}>
      {variant === 'fade' ? (
        <FadeLoader
          color={color}
          // FadeLoader supports height, width, radius; size is a convenience mapping
          height={Math.max(6, Math.floor(size / 4))}
          width={Math.max(3, Math.floor(size / 8))}
          radius={Math.max(2, Math.floor(size / 12))}
          margin={Math.max(1, Math.floor(size / 24))}
          speedMultiplier={1}
          loading
        />
      ) : (
        <MoonLoader
          color={color}
          size={size}
          speedMultiplier={1}
          loading
        />
      )}
    </div>
  );
};

export default Loader;

// Centered, green FadeLoader at medium size:
// <Loader visible variant="fade" color="#16a34a" size={48} />


// Top-right small blue MoonLoader:
// <Loader
//   visible
//   variant="moon"
//   color="#2563eb"   // Tailwind blue-600
//   size={24}
//   center={false}
//   className="fixed top-3 right-3"
// />


// Inline loader with custom margin and inherited text color:
// <Loader
//   visible
//   variant="fade"
//   color="currentColor"
//   size={40}
//   center={false}
//   className="ml-4 inline-flex align-middle"
// />
