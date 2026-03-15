interface AvatarProps {
  size?: 'large' | 'small';
}

const ZAvatar = ({ size = 'large' }: AvatarProps) => (
  <div className={`avatar ${size}`}>
    <span className="letter">Z</span>
  </div>
);

export default ZAvatar;
