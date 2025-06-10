type UserFiltersProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  filterBy: string;
  onFilterChange: (value: string) => void;
  onAddUser: () => void;
};

function UserFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  onAddUser,
}: UserFiltersProps) {
  return (
    <div className="controls">
      <input
        type="text"
        placeholder="사용자 검색..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <select onChange={(e) => onSortChange(e.target.value)} value={sortBy}>
        <option value="name">이름순</option>
        <option value="email">이메일순</option>
        <option value="role">역할순</option>
      </select>
      <select onChange={(e) => onFilterChange(e.target.value)} value={filterBy}>
        <option value="all">전체</option>
        <option value="active">활성</option>
        <option value="inactive">비활성</option>
      </select>
      <button type="button" onClick={onAddUser}>
        새 사용자 추가
      </button>
    </div>
  );
}

export default UserFilters;
