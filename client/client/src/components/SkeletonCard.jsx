import { motion } from 'framer-motion';

const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' }
  }
};

const SkeletonBox = ({ w = '100%', h = '16px', radius = '8px', mb = '0' }) => (
  <motion.div
    {...shimmer}
    style={{
      width: w, height: h,
      borderRadius: radius,
      marginBottom: mb,
      background: 'linear-gradient(90deg, #1c2128 25%, #2d333b 50%, #1c2128 75%)',
      backgroundSize: '200% 100%',
    }}
  />
);

export const SkeletonCard = () => (
  <div style={{
    borderRadius: '20px', overflow: 'hidden',
    background: '#161b22',
    border: '1px solid #30363d'
  }}>
    <SkeletonBox h="220px" radius="0" />
    <div style={{ padding: '16px' }}>
      <SkeletonBox w="60%" h="10px" mb="10px" />
      <SkeletonBox w="90%" h="16px" mb="10px" />
      <SkeletonBox w="40%" h="20px" mb="14px" />
      <SkeletonBox h="42px" radius="12px" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px'
  }}>
    {Array(count).fill(0).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;