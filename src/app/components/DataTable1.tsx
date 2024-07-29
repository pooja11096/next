import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from ''; // You'll need to create this type

const DataTable1: React.FC = () => {
  const formData = useSelector((state: RootState) => state.formData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = formData.filter(item =>
    item.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = sortField
    ? [...filteredData].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredData;

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('personName')}>Person Name</th>
            <th onClick={() => handleSort('customer')}>Customer</th>
            <th onClick={() => handleSort('totalAmount')}>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.personName}</td>
              <td>{item.customer}</td>
              <td>{item.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
        <span>Page {currentPage} of {Math.ceil(sortedData.length / itemsPerPage)}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(sortedData.length / itemsPerPage)))}>Next</button>
      </div>
    </div>
  );
};

export default DataTable1;