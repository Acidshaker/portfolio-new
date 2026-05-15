import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import Table from "@mui/material/Table";
import React, { useEffect, useMemo, useState } from "react";

interface LocalTableHeader<T = any> {
  key: keyof T | string;
  label: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

interface LocalBaseTableProps<T = any> {
  title?: string;
  subtitleChildren?: React.ReactNode;
  data: T[];
  headers: LocalTableHeader<T>[];
  actionsRender?: (row: T) => React.ReactNode;

  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterFn?: (data: T[]) => T[];

  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
}

function LocalBaseTable<T = any>({
  title,
  subtitleChildren,
  data,
  headers,
  actionsRender,
  searchValue,
  onSearchChange,
  filterFn,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
}: LocalBaseTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (orderBy === key) {
      setOrderDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(key);
      setOrderDirection("asc");
    }
  };

  const processedData = useMemo(() => {
    let result = [...data];

    if (filterFn) {
      result = filterFn(result);
    }

    if (orderBy) {
      result.sort((a: any, b: any) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return orderDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        return orderDirection === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [data, filterFn, orderBy, orderDirection]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return processedData.slice(start, start + rowsPerPage);
  }, [processedData, page, rowsPerPage]);

  // useEffect(() => {
  //   console.log(data)
  // }, []);

  return (
    <Fade in timeout={500}>
      <Paper sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          sx={{
            px: 2,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {title && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6">{title}</Typography>
              {subtitleChildren && subtitleChildren}
            </Box>
          )}

          {onSearchChange && (
            <TextField
              size="small"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => {
                setPage(0);
                onSearchChange(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Box>

        <TableContainer sx={{ flex: 1, position: "relative" }}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={String(header.key)}
                    align={header.align ?? "center"}
                    onClick={() =>
                      header.sortable && handleSort(String(header.key))
                    }
                    sx={{
                      cursor: header.sortable ? "pointer" : "default",
                      userSelect: "none",
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={0.5}
                    >
                      {header.label}
                      {header.sortable &&
                        orderBy === header.key &&
                        (orderDirection === "asc" ? (
                          <ArrowDropUpIcon fontSize="small" />
                        ) : (
                          <ArrowDropDownIcon fontSize="small" />
                        ))}
                    </Box>
                  </TableCell>
                ))}

                {actionsRender && (
                  <TableCell align="center">Acciones</TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((row, idx) => (
                <Fade in timeout={300} key={idx}>
                  <TableRow>
                    {headers.map((header) => (
                      <TableCell
                        key={String(header.key)}
                        align={header.align ?? "center"}
                      >
                        {header.render
                          ? header.render(
                              (row as any)[header.key],
                              row,
                              page * rowsPerPage + idx + 1,
                            )
                          : (row as any)[header.key]}
                      </TableCell>
                    ))}

                    {actionsRender && (
                      <TableCell align="center">{actionsRender(row)}</TableCell>
                    )}
                  </TableRow>
                </Fade>
              ))}
            </TableBody>
          </Table>

          {processedData.length === 0 && (
            <Fade in>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  opacity: 0.7,
                }}
              >
                <SentimentVeryDissatisfiedIcon fontSize="large" />
                <Typography>No se encontraron resultados</Typography>
              </Box>
            </Fade>
          )}
        </TableContainer>

        <TablePagination
          component="div"
          count={processedData.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={rowsPerPageOptions}
          labelRowsPerPage="Elementos por página"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>
    </Fade>
  );
}

export default LocalBaseTable;
