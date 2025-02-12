import * as Slider from "@radix-ui/react-slider";

export default function TempoSlider({ value, onChange }) {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex justify-center items-center">
        <span className="text-black font-bold">Tempo</span>
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        defaultValue={[value]}
        value={[value]}
        onValueChange={([newValue]) =>
          onChange({ target: { value: newValue } })
        }
        max={240}
        min={30}
        step={1}
      >
        <Slider.Track className="bg-secondary/20 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-gradient-to-r from-accent-1 to-accent-2 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-gradient-to-r from-accent-1 to-accent-2 rounded-full hover:scale-110 transition-transform focus:outline-none"
          aria-label="Tempo"
        />
      </Slider.Root>
    </div>
  );
}
