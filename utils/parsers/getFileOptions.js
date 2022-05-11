import React from "react";
import {onCreate} from "../visuals/getDirectoryOptions";
import handleDelete from "../handleDelete";
import AsyncFS from "../../../../../components/AsyncFS";

const template = `
class YourClassName{
    state = {} // Your system state here
    
    constructor(){
        // Do your initialization state here
    }
    
    execute(params){
        // Called every frame
        
        // TEMPLATES    
        this.eventTick(params)
        // Some key pressed (example with KeyA)
        if(params.pressedKeys.KeyA && !this.state.pressedKeyA){
                this.state.pressedKeyA = true
                this.onKeyDown(params)
        }
        else if(params.pressedKeys.KeyA && this.state.pressedKeyA)
            this.onHold(params)
                
        else if(!params.pressedKeys.KeyA && this.state.pressedKeyA){
            this.state.pressedKeyA = false
            this.onRelease(params)
       }
    }
    
    // Templates
    eventTick(params){
        // Do things here
    }
    onHold(params){
        // Do things here
    }
    onKeyDown(params){
        // Do things here
    }
    onRelease(params){
        // Do things here
    }
}
`
const {shell} = window.require('electron')
export default function getFileOptions(hook, setCurrentItem, bookmarksHook) {
    const check = async (path, ext) => {
        let n = path + ext
        let it = 0

        while (await hook.fileSystem.assetExists(n)) {
            it++
            n = path + `(${it})` + ext
        }

        return n
    }
    return [
        {
            requiredTrigger: 'data-folder',
            label: 'Delete',
            icon: <span className={'material-icons-round'}>delete</span>,
            onClick: (node) => handleDelete(node.getAttribute('data-folder'), hook, bookmarksHook)
        },
        {
            requiredTrigger: 'data-folder',
            label: 'New sub-folder',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: (node) => onCreate(node.getAttribute('data-folder'), hook).catch()
        },
        {
            requiredTrigger: 'data-folder',
            label: 'Rename',
            icon: <span className={'material-icons-round'}>edit</span>,
            onClick: (node) => {
                setCurrentItem(node.getAttribute('data-folder'))
            }
        },
        {
            requiredTrigger: 'data-file',
            label: 'Rename',
            icon: <span className={'material-icons-round'}>edit</span>,
            onClick: (node) => {
                setCurrentItem(node.getAttribute('data-file'))
            }
        },
        {
            requiredTrigger: 'data-file',
            label: 'Delete',
            icon: <span className={'material-icons-round'}>delete</span>,
            onClick: (node) => handleDelete(node.getAttribute('data-file'), hook)

        },

        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'New Material',
            icon: <span className={'material-icons-round'}>texture</span>,
            onClick: async () => {
                let path = await check(hook.currentDirectory.id + '\\New Material', '.material')
                hook.fileSystem.writeAsset(path, JSON.stringify({}))
                    .then(() => {
                        hook.refreshFiles()
                    })
            }
        },
        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'New Blueprint',
            icon: <span className={'material-icons-round'}>code</span>,
            onClick: async () => {
                let path = await check(hook.currentDirectory.id + '\\New Blueprint', '.flow')

                hook.fileSystem.writeAsset(path, JSON.stringify({}))
                    .then(() => {
                        hook.refreshFiles()
                    })
            }
        },

        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'New directory',
            icon: <span className={'material-icons-round'}>create_new_folder</span>,
            onClick: () => {

                let path = hook.currentDirectory.id + '\\New folder'

                const existing = hook.fileSystem.foldersFromDirectory(hook.path + hook.currentDirectory.id)
                if (existing.length > 0)
                    path += ' - ' + existing.length

                const [e] = AsyncFS.mkdir(hook.path + path, {})
                if (!e)
                    hook.refreshFiles()
            }
        },
        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'Open with explorer',
            icon: <span className={'material-icons-round'}>open_in_new</span>,
            onClick: () => {
                shell.openPath(hook.path + '\\' + hook.currentDirectory.id).catch()
            }
        },
        {
            requiredTrigger: 'data-folder-wrapper',
            label: 'New raw Blueprint',
            icon: <span className={'material-icons-round'}>code</span>,
            onClick: async () => {
                let path = await check(hook.currentDirectory.id + '\\New Raw Blueprint', '.flowRaw')

                hook.fileSystem.writeAsset(path, template)
                    .then(() => {
                        hook.refreshFiles()
                    })
            }
        },
    ]
}