import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "@/store/uiSlice";
import { sales } from "@/services/endpoints";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  handleClose: () => void;
  data?: any;
}

export const SaleStats = ({ open, handleClose, data }: Props) => {
  if (!data) return null;
  const dispatch = useDispatch();

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100% - 32px)",
    maxWidth: "1350px",
    maxHeight: "90vh",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
  };

  const stats = data.products.map((p: any) => {
    const qty = Number(p.quantity);
    const unitPrice = Number(p.unit_price);
    const unitCost = Number(p.unit_cost);

    const profitPerUnit = unitPrice - unitCost;
    const totalSale = qty * unitPrice;
    const totalCost = qty * unitCost;
    const totalProfit = totalSale - totalCost;

    return {
      date: data.date,
      supplier: p.supplier?.name || "No asignado",
      client: data.client?.name || "N/A",
      product: p.name,
      unitName: p.unit?.name || "N/A",
      quantity: qty,
      buyPrice: unitCost.toFixed(2),
      sellPrice: unitPrice.toFixed(2),
      profitPerUnit: profitPerUnit.toFixed(2),
      totalCost: totalCost.toFixed(2),
      totalSale: totalSale.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
    };
  });

  const grandTotalProfit = stats.reduce(
    (acc: number, curr: any) => acc + Number(curr.totalProfit),
    0,
  );

  const generateExcel = async () => {
    dispatch(showLoading());
    try {
      const res = await sales.downloadExcel(data.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `estadisticas_venta_${data.folio}.xlsx`);
      document.body.appendChild(link);
      link.click();
      toast.success("Reporte Excel generado correctamente");
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {/* Encabezado */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar color="primary" sx={{ bgcolor: "background.default" }}>
                <PointOfSaleIcon color="primary" />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Venta
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Folio de Venta: {data.folio}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="success"
              startIcon={<FileDownloadIcon />}
              onClick={generateExcel}
            >
              Generar Reporte Excel
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Tabla con nombres completos y temas del sistema */}
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ flex: 1, overflowY: "auto" }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>FECHA</TableCell>
                  <TableCell>PROVEEDOR</TableCell>
                  <TableCell>CLIENTE</TableCell>
                  <TableCell>PRODUCTO</TableCell>
                  <TableCell align="center">UNIDAD DE MEDIDA</TableCell>
                  <TableCell align="center">CANTIDAD</TableCell>
                  <TableCell align="right">PRECIO DE COMPRA</TableCell>
                  <TableCell align="right">PRECIO DE VENTA</TableCell>
                  <TableCell align="right">GANANCIA POR UNIDAD</TableCell>
                  <TableCell align="right">IMPORTE DE COMPRA</TableCell>
                  <TableCell align="right">IMPORTE DE VENTA</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    GANANCIA TOTAL
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.map((row: any, index: number) => (
                  <TableRow key={index} hover>
                    <TableCell>{row.date}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {row.supplier}
                    </TableCell>
                    <TableCell>{row.client}</TableCell>
                    <TableCell sx={{ fontSize: "0.75rem" }}>
                      {row.product}
                    </TableCell>
                    <TableCell align="center">{row.unitName}</TableCell>
                    <TableCell align="center">{row.quantity}</TableCell>
                    <TableCell align="right">$ {row.buyPrice}</TableCell>
                    <TableCell align="right">$ {row.sellPrice}</TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      $ {row.profitPerUnit}
                    </TableCell>
                    <TableCell align="right">$ {row.totalCost}</TableCell>
                    <TableCell align="right">$ {row.totalSale}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: "bold",
                        color: "success.main",
                        bgcolor: "action.hover",
                      }}
                    >
                      $ {row.totalProfit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer de Resumen */}
          <Box
            mt={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="caption" color="text.secondary">
              * Valores calculados en base a precios unitarios y cantidades
              registradas.
            </Typography>
            <Paper
              variant="outlined"
              sx={{ p: 2, minWidth: 320, textAlign: "right" }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                UTILIDAD NETA TOTAL
              </Typography>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                ${" "}
                {grandTotalProfit.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                })}
              </Typography>
            </Paper>
          </Box>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleClose} variant="text" color="inherit">
              Cerrar Ventana
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
