import { IconName } from "./constants/model";

type FileIconProps = React.SVGProps<SVGSVGElement> & {
    fill?: string;
};

function FileIcon({ fill = '#8C93A1', ...props }: FileIconProps) {
    return (
        <svg
            fill="none"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z"
                fill={fill}
                fillRule="evenodd"
                clipRule="evenodd"
            />
        </svg>
    );
}


type InfoClockIconProps = React.SVGProps<SVGSVGElement> & {
    strokeColor?: string;
};

function InfoClockIcon({ strokeColor = '#8C93A1', ...props }: InfoClockIconProps) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M7.95835 8.16667H9.00002L9.00002 12.5417M16.7084 9.00001C16.7084 13.2572 13.2572 16.7083 9.00002 16.7083C4.74283 16.7083 1.29169 13.2572 1.29169 9.00001C1.29169 4.74281 4.74283 1.29167 9.00002 1.29167C13.2572 1.29167 16.7084 4.74281 16.7084 9.00001Z"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

type PlusIconProps = React.SVGProps<SVGSVGElement> & {
    strokeColor?: string;
};

function PlusIcon({ strokeColor = 'black', ...props }: PlusIconProps) {
    return (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" {...props}>
            <path
                d="M4 1.167V4M4 4V6.833M4 4H1.167M4 4H6.833"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>

    );
}

type CheckCircleIconProps = React.SVGProps<SVGSVGElement> & {
    strokeColor?: string;
    size?: number;
};

function CheckCircleIcon({
    strokeColor = '#8C93A1',
    ...props
}: CheckCircleIconProps) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M11.5 6.91667L7.75001 11.5L6.08334 9.83334M16.7083 9.00001C16.7083 13.2572 13.2572 16.7083 9.00001 16.7083C4.74281 16.7083 1.29167 13.2572 1.29167 9.00001C1.29167 4.74281 4.74281 1.29167 9.00001 1.29167C13.2572 1.29167 16.7083 4.74281 16.7083 9.00001Z"
                stroke={strokeColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}



type IconProps = {
  iconName: IconName;
} & React.SVGProps<SVGSVGElement> & {
  fill?: string;
  strokeColor?: string;
  size?: number;
};

export default function Icon({ iconName, fill, strokeColor, size, ...props }: IconProps) {
  switch (iconName) {
    case 'file':
      return <FileIcon fill={fill} {...props} />;
    case 'infoClock':
      return <InfoClockIcon strokeColor={strokeColor} {...props} />;
    case 'plus':
      return <PlusIcon strokeColor={strokeColor} {...props} />;
    case 'checkCircle':
      return <CheckCircleIcon strokeColor={strokeColor} size={size} {...props} />;
    default:
      return null;
  }
}