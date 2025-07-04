import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DescriptionIcon from '@mui/icons-material/Description';

export const capitalize = (value) => {
  if (!value) return "";
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const statusColors = {
  submitted: "default",
  forwarded: "info",
  reviewed: "info",
  approved: "success",
  rejected: "error",
};

export const getFileIcon = (fileName) => {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return (
        <PictureAsPdfIcon color="error" style={{ marginRight: 8 }} />
      );
    case 'jpg':
    case 'jpeg':
    case 'png':
      return (
        <InsertPhotoIcon color="success" style={{ marginRight: 8 }} />
      );
    default:
      return (
        <DescriptionIcon color="primary" style={{ marginRight: 8 }} />
      );
  }
};
