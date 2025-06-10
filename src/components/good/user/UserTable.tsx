import UserTableRow from '@/components/good/user/UserTableRow';
import type { User } from '@/types/type';

type UserTableProps = {
  users: User[];
  onSort: (field: string) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
};

function UserTable({ users, onEdit, onDelete, onSort }: UserTableProps) {
  const handleKeyDown = (event: React.KeyboardEvent, value: string) => {
    if (event.key === 'Enter') {
      onSort(value);
    }
  };

  return (
    <div className="user-table">
      <table>
        <thead>
          <tr>
            <th
              onClick={() => onSort('name')}
              onKeyDown={(e) => handleKeyDown(e, 'name')}
            >
              이름
            </th>
            <th
              onClick={() => onSort('email')}
              onKeyDown={(e) => handleKeyDown(e, 'email')}
            >
              이메일
            </th>
            <th
              onClick={() => onSort('role')}
              onKeyDown={(e) => handleKeyDown(e, 'role')}
            >
              역할
            </th>
            <th>부서</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
