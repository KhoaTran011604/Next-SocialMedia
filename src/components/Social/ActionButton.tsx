const ActionButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button className="flex w-1/3 items-center justify-center rounded-lg py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50">
    <span className="mr-1">{icon}</span>
    {label}
  </button>
);

export default ActionButton;
