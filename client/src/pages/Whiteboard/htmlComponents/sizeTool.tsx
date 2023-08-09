import { ButtonGroup, ToggleButton } from 'react-bootstrap'

const getSizeTool = (sizes: { name: string; value: string; }[],
  sizeValue: string, setSizeValue: React.Dispatch<React.SetStateAction<string>>) => {
  const sizeTool = (<ButtonGroup className="ms-auto" >
    {sizes.map((size, idx) => (
      <ToggleButton
        key={idx}
        id={`size-${idx}`}
        type="radio"
        variant="outline-dark"
        size="sm"
        name="size"
        value={size.value}
        checked={sizeValue === size.value}
        onChange={(e) => setSizeValue(e.currentTarget.value)}
      >
        {size.name}
      </ToggleButton>
    ))}
  </ButtonGroup>)

  return sizeTool
}

export default getSizeTool