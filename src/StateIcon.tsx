import { type Accessor, type JSX, type Component, createMemo } from "solid-js";
import type { Status } from "./ReactionBox";

type IconProps = {
  alt: string;
  class: string;
  width: number;
};

const BoltIcon: Component<IconProps> = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    role="img"
    aria-label={props.alt}
    width={props.width}
    class={props.class}
  >
    <path
      fill-rule="evenodd"
      d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
      clip-rule="evenodd"
    />
  </svg>
);

const ClockIcon: Component<IconProps> = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    role="img"
    aria-label={props.alt}
    width={props.width}
    class={props.class}
  >
    <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
  </svg>
);

const EllipsisIcon: Component<IconProps> = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    role="img"
    aria-label={props.alt}
    width={props.width}
    class={props.class}
  >
    <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
  </svg>
);

const ErrorIcon: Component<IconProps> = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    role="img"
    aria-label={props.alt}
    width={props.width}
    class={props.class}
  >
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
  </svg>
);

type Props = {
  class: string;
  status: Accessor<Status>;
};

export default function StateIcon(props: Props): JSX.Element {
  const icons: Record<Status, JSX.Element> = {
    start: <BoltIcon alt="Ready" class={props.class} width={100} />,
    active: <EllipsisIcon alt="Active" class={props.class} width={80} />,
    ready: <EllipsisIcon alt="Press" class={props.class} width={80} />,
    done: <ClockIcon alt="Result" class={props.class} width={80} />,
    error: <ErrorIcon alt="Too early" class={props.class} width={100} />,
  };

  const icon = createMemo(() => icons[props.status()]);
  return icon as unknown as JSX.Element;
}
