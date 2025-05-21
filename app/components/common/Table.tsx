import { TableProps } from 'app/types/portal-types';
import React, { FC } from 'react';

const Table: FC<TableProps> = ({ head, body }) => {
  return (
    <table className="w-full">
      <thead className="h-12">{head}</thead>
      <tbody>{body}</tbody>
    </table>
  );
};

export default Table;
