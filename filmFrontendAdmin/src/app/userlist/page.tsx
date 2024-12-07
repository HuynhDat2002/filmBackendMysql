'use client'

import React, { useState, useEffect } from "react"
import Image from 'next/image'

import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
  } from "@nextui-org/table";

export default function UserList() {
    const columns = [
        { key: "name", label: "Name" },
        { key: "age", label: "Age" },
        { key: "email", label: "Email" }
    ];
    
    const rows = [
        { key: "1", name: "Alice", age: 25, email: "alice@example.com" },
        { key: "2", name: "Bob", age: 30, email: "bob@example.com" },
        { key: "3", name: "Charlie", age: 35, email: "charlie@example.com" }
    ];
    const getKeyValue = (row:any, columnKey:any) => row[columnKey];
    return (
     

         <Table aria-label="Example table with dynamic content">
      <TableHeader className="font-bold">
          <TableColumn key='id'>ID</TableColumn>
          <TableColumn key='name'>Name</TableColumn>
          <TableColumn key='email'>Email</TableColumn>
          <TableColumn key='Created Time'>Created Time</TableColumn>
          <TableColumn key='Updated Time'>Updated Time</TableColumn>
      </TableHeader>
      <TableBody>
        {rows.map((row) =>
          <TableRow key={row.key}>
            {(columnKey) => <TableCell>{getKeyValue(row, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
 
  
    )
}