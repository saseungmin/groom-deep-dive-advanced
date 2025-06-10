import type { User } from '@/types/type';

type UserTableRowProps = {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
};

function UserTableRow({ user, onEdit, onDelete }: UserTableRowProps) {
  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      onDelete(user.id);
    }
  };

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>{user.department}</td>
      <td className={user.status}>{user.status}</td>
      <td>
        <button type="button" onClick={() => onEdit(user)}>
          수정
        </button>
        <button type="button" onClick={handleDelete}>
          삭제
        </button>
      </td>
    </tr>
  );
}

export default UserTableRow;
