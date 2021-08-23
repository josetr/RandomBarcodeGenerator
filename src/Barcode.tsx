import { useBarcode } from 'react-barcodes';

interface BarcodeProps {
  name: string
  value: string
}

const Barcode = ({ name, value }: BarcodeProps) => {
  const { inputRef } = useBarcode({
    value: value,
    options: {
      width: 2,
      height: 100
    }
  });

  return <>
    <div>{name}</div>
    <svg ref={inputRef} />
  </>;
}

export default Barcode