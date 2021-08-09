import React from "react";
import _css from './self.module.css'

interface IProps {
    txt:string
}

const Test = function (props: IProps) {

    return (
        <div className={_css.test}>
            {props.txt}
        </div>
    )
}

export default Test