import * as React from "react";
import { HorizontalStep } from "@/components/ui/stepper/horizontal-step";
import { useStepper } from "@/components/ui/stepper/use-stepper";
import { VerticalStep } from "@/components/ui/stepper/vertical-step";
import type { StepProps } from "@/components/ui/stepper/types";

// Props which shouldn't be passed to to the Step component from the User.
interface StepInternalConfig {
  index: number;
  isCompletedStep?: boolean;
  isCurrentStep?: boolean;
  isLastStep?: boolean;
}

interface FullStepProps extends StepProps, StepInternalConfig {}

const Step = React.forwardRef<HTMLDivElement, StepProps>((props, ref) => {
  const {
    children,
    description,
    icon,
    state,
    checkIcon,
    errorIcon,
    index,
    isCompletedStep,
    isCurrentStep,
    isLastStep,
    isKeepError,
    label,
    onClickStep,
  } = props as FullStepProps;

  const { isVertical, isError, isLoading, clickable } = useStepper();

  const hasVisited = isCurrentStep || isCompletedStep;

  const sharedProps = {
    isLastStep,
    isCompletedStep,
    isCurrentStep,
    index,
    isError,
    isLoading,
    clickable,
    label,
    description,
    hasVisited,
    icon,
    isKeepError,
    checkIcon,
    state,
    errorIcon,
    onClickStep,
  };

  const renderStep = () => {
    switch (isVertical) {
      case true:
        return (
          <VerticalStep ref={ref} {...sharedProps}>
            {children}
          </VerticalStep>
        );
      default:
        return <HorizontalStep ref={ref} {...sharedProps} />;
    }
  };

  return renderStep();
});

Step.displayName = "Step";

export { Step };
