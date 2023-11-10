import "./CopyClipboardButton.css"
import { useRef, useState } from "react";
import Tooltip from '@mui/material/Tooltip';

export const CopyToClipboard = (props) => {
    const [ToolTipTitle, setToolTipTitle] = useState("Copy Group Code: " + props.item_for_copy)
    function copyItem() {
        navigator.clipboard.writeText(props.item_for_copy);
        changedToolTip();
    }
    function defaultToolTip() {
        setToolTipTitle("Copy Group Code: " + props.item_for_copy)
    }
    function changedToolTip() {
        setToolTipTitle("Copied: " + props.item_for_copy)
    }
    return (
        <Tooltip title={ToolTipTitle} arrow PopperProps={{style:{zIndex:10000}}}><button className="btn btn-light clipboardbutton" style={{}} onClick={copyItem} onMouseEnter={defaultToolTip}></button></Tooltip>
    )
}







