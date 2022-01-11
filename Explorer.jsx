import styles from './styles/Explorer.module.css'
import PropTypes from "prop-types";
import React, {useState} from "react";
import Directories from "./components/Directories";
import Items from "./components/Items";
import Control from "./components/Control";
import Visualizer from "./components/Visualizer";

export default function Explorer(props) {
    const [selected, setSelected] = useState()
    const [hidden, setHidden] = useState(true)
    return (
        <div className={styles.wrapper} style={{height: hidden ? '35px' : undefined}} ref={props.hook.ref}>
            <Visualizer setSelected={setSelected} selected={selected} hook={props.hook}/>
            <Control hidden={hidden} setHidden={setHidden} {...props}/>
            {hidden ?
                null :
                <div className={styles.content}>
                    <Directories {...props}/>
                    <Items
                        {...props}
                        setSelected={setSelected}
                        accept={props.accept ? props.accept : []}
                    />
                </div>
            }
        </div>
    )
}

Explorer.propTypes = {
    openEngineFile: PropTypes.func.isRequired,
    hook: PropTypes.object.isRequired,
    accept: PropTypes.array,
    label: PropTypes.string,
    setAlert: PropTypes.func.isRequired
}
