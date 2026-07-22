import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logokb2.png"
            alt="Logo KawanBerbagi"
            {...(props as any)}
        />
    );
}
