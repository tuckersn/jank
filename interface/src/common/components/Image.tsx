import { CSSProperties, useEffect, useState } from "react";
import { BehaviorSubject, Observable } from "rxjs";

export function Image({
    src,
    height,
    width,
    fill = false
} : {
    src: Observable<string> | string,
    height?: number | 'auto',
    width?: number | 'auto',
    /**
     * If fill is set height and width aren't relevant.
     */
    fill?: boolean
}) {
    const [_src,setSrc] = useState('DEFAULT VALUE');
    
    let style: CSSProperties = {
        pointerEvents: 'none'
    };

    if(fill) {
        style = {
            ...style,
            objectFit: 'contain',
            height: '100%',
            width: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            position: 'relative',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };
        height = 'auto';
        width = 'auto';
    }
    
    useEffect(() => {
        if(typeof src === 'string') {
            setSrc(src);
        } else {
            src.subscribe((newSrc) => {
                setSrc(newSrc);
            });
        }
    }, []);

    useEffect(() => {
        if(typeof src === 'string') {
            setSrc(src);
        }
    }, [src]);
    
    return <div style={{
        ...(fill ? {
            width: '100%',
            height: '100%'
        } : {
            width,
            height
        })
    }}>
        <img height={height} width={width} style={style} src={_src}/>
    </div>;
}