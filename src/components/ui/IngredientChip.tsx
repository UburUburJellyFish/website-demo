type IngredientChipProps = {
  name: string;
  /** data-px target, e.g. "ingredient-1". */
  target?: string;
};

// An ingredient Claire found in the meal photo. Names only: the app stores grams but does not show them.
export function IngredientChip({ name, target }: IngredientChipProps) {
  return (
    <li
      data-px={target}
      className="type-small flex w-fit items-center gap-2 rounded-full bg-home-card px-4 py-2 font-medium whitespace-nowrap text-home-ink shadow-card max-md:px:gap-1.5 max-md:px:px-2.5 max-md:px:py-1.5"
    >
      <span aria-hidden className="size-2 rounded-full bg-card-meal" />
      {name}
    </li>
  );
}
