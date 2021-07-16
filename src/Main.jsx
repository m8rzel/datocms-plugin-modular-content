import React, { Component } from 'react'
import './style.sass';
export default class Main extends Component {
  constructor(props){
    super(props)
    this.state = {
      allContent: [],
    }
  }
  render() {
    const {plugin, fieldValue, modularBlocks} = this.props;
    const modularBlocksArray = modularBlocks.split(",");
    const createFields = (fieldContent) => {
      if(fieldContent.field_type === 'string'){
        console.log("Created text field")
        return(<><p className="label">{fieldContent.label}</p><p className="apiKey">{fieldContent.api_key}</p><input className="default-input" type='text' placeholder={fieldContent.label}></input></>)
      }
      if(fieldContent.field_type === 'text'){
        return(<><p className="label">{fieldContent.label}</p><p className="apiKey">{fieldContent.api_key}</p><textarea className="default-input" placeholder={fieldContent.label}></textarea></>)
      }
    }
    const handleOptionSelected = (modelID) => {
      const fieldArray = plugin.itemTypes[modelID].relationships.fields.data;
      const contentName = plugin.itemTypes[modelID].attributes.name;
      const contentApiKey = plugin.itemTypes[modelID].attributes.api_key;
      console.log("Fieldarray", fieldArray)
      var newContent = this.state.allContent;
      newContent.push({'name': contentName, 'fields': fieldArray, 'api_key': contentApiKey});
      this.setState({allContent: newContent}, () => {
        console.log("Neu Content", this.state.allContent)
      })
      //console.log("Model Click", plugin.itemTypes[modelID].relationships.fields.data)
    }
    return (
      <>
      <div className="container">
        {this.state.allContent.length !== 0 &&
          this.state.allContent.map((content) => {
            return(
              <div className="content-container">
                <h5>{content.name}</h5><svg viewBox="0 0 192 512" width="1em" height="1em"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg>
                {
                  content.fields.map(field => {
                    if(field.type === 'field'){
                      console.log("Field type Field")
                      const fieldContent = plugin.fields[field.id].attributes;
                      return(createFields(fieldContent))
                    }
                  })
                }
              </div>
            )
          })
        }
      </div>
      <div className="container">
        <select onChange={(e) => handleOptionSelected(e.target.value)}>
          {
            modularBlocksArray.map(modularBlock => {
              return(
                <option value={modularBlock.trim()}>{plugin.itemTypes[modularBlock.trim()].attributes.name}</option>
              )
            })
          }
        </select>
      </div>
      </>
    )
  }
}

