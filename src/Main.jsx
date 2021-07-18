import React, { Component } from 'react'
import './style.sass';
import $ from 'jquery'  
export default class Main extends Component {
  constructor(props){
    super(props)
    this.state = {
      allContent: [],
      links: [],
      formatedContent: [],
    }
  }
  componentDidMount(){
    if(this.props.fieldValue !== null) {
      this.setState({allContent: JSON.parse(this.props.fieldValue), links: []})
    }
  }
  render() {
    const {plugin, fieldValue, modularBlocks} = this.props;
    const modularBlocksArray = modularBlocks.split(",");
    const createFields = (id, fieldContent) => {
      if(fieldContent.field_type === 'string'){
        //console.log("Created text field")
        return(<><p className="label">{fieldContent.label}</p><p className="apiKey">{fieldContent.api_key}</p><input onChange={(e) => handleInputChange(id, e.target.value, fieldContent.api_key)} value={fieldContent.value} className="default-input" type='text' placeholder={fieldContent.label}></input></>)
      }
      if(fieldContent.field_type === 'text'){
        return(<><p className="label">{fieldContent.label}</p><p className="apiKey">{fieldContent.api_key}</p><textarea onChange={(e) => handleInputChange(id, e.target.value, fieldContent.api_key)} value={fieldContent.value} className="default-input" placeholder={fieldContent.label}></textarea></>)
      }
      if(fieldContent.field_type === 'file'){
        return(
          <>
            <p className="label">{fieldContent.label}</p>
            <p className="apiKey">{fieldContent.api_key}</p>
            <div className="image-upload" onClick={() => selectUploadFile(id, fieldContent.api_key)}>
              {
                fieldContent.value === ''
                ? <p>Mediendatei auswählen</p>
                : <img src={fieldContent.value}/>
              }
            </div>
          </>
        )
      }
      if(fieldContent.field_type === 'links'){
        return(
          <>
            <p className="label">{fieldContent.label}</p>
            <p className="apiKey">{fieldContent.api_key}</p>  
            <ul className="input-links" onClick={() => selectLinks(fieldContent.links[0])}>
              {
                this.state.links.map((link, i) => {
                  return(<li>{link.id}</li>)
                })
              }
            </ul>
          </>

        )
      }
    }
    const handleLinks = (item) => {
      const newLinks = this.state.links;
      newLinks.push(item);
      console.log("Newslinks", newLinks);
      this.setState({links: newLinks}, () => {
        console.log("links saved", this.state.links[0])
      })
    }
    const selectLinks = (id) => {
      console.log("ID", id)
      plugin.selectItem(id)
        .then(function(item) {
          if (item) {
            console.log('Item selected: ', item.id);
            handleLinks(item)
          } else {
            console.log('Modal closed!');
          }
        });
    }
    const setFieldValueJSON = (newContentArray) => {
      this.setState({allContent: newContentArray}, () => {
        plugin.setFieldValue(plugin.fieldPath, JSON.stringify(this.state.allContent))
      })
    }
    const handleInputChange = (id, value, apiKey) => {
      const newContentArray = this.state.allContent;
      const currentIndex = newContentArray.findIndex(content => content.id === id);
      const currentFieldIndex = newContentArray[currentIndex].fields.findIndex(field => field.api_key === apiKey)
      newContentArray[currentIndex].fields[currentFieldIndex].value = value;
      setFieldValueJSON(newContentArray)
    }
    const selectUploadFile = (id, apiKey) => {
      plugin.selectUpload()
        .then(function(upload) {
          if (upload) {
            //console.log('Upload selected: ', upload);
            handleInputChange(id, upload.attributes.url, apiKey)
          } else {
            //console.log('Modal closed!');
          }
        });
    }
    const handleOptionSelected = (modelID) => {
      $('.modelChoose').css('display', 'none')
      const fieldArray = plugin.itemTypes[modelID].relationships.fields.data;
      const contentName = plugin.itemTypes[modelID].attributes.name;
      const contentApiKey = plugin.itemTypes[modelID].attributes.api_key;
      var newFieldArray = fieldArray.map(field => {
        if(field.type === 'field'){
          const fieldContent = plugin.fields[field.id].attributes;
          console.log("Field", fieldContent)
          return({field_type: fieldContent.field_type, label: fieldContent.label, api_key: fieldContent.api_key, value: '', links: fieldContent.field_type === 'links' && fieldContent.validators.items_item_type.item_types})
        }
      })
      var newContent = this.state.allContent;
      newContent.push({'id': Date.now(), 'name': contentName, 'fields': newFieldArray, 'api_key': contentApiKey,});
      this.setState({allContent: newContent}, () => {
        //console.log("Neu Content", this.state.allContent)
      })
      //console.log("Model Click", plugin.itemTypes[modelID].relationships.fields.data)
    }
    const handleCollapseExpand = (i) => {
      if($(`#content-${i}`).height() !== 40){
        $(`#content-${i}`).css("height", "40px");
        $(`#content-fields-${i}`).css("display", "none");
        $(`#arrow-${i}`).css("transform", "rotate(-90deg)");
      } else{
        $(`#content-${i}`).css("height", "100%");
        $(`#content-fields-${i}`).css("display", "block");
        $(`#arrow-${i}`).css("transform", "rotate(0deg)");
      }
    }
    const toggleMenu = (i, type) => {
      if(type === true){
        $(`#dots-options-${i}`).css("display", "block");
      } else{
        $(`#dots-options-${i}`).css("display", "none");
      }
    }
    const deleteContent = (i, id) => {
      $(`#dots-options-${i}`).css("display", "none");
      const contentArray = this.state.allContent;
      const currentIndex = contentArray.findIndex(content => content.id === id)
      contentArray.splice(currentIndex, 1)
      setFieldValueJSON(contentArray)
    }
    const showModelMenu = (type) => {
      if(type === true){
        $('.modelChoose').css('display', 'block')
      } else{
        $('.modelChoose').css('display', 'none')
      }
    }
    return (
      <>
      <div className="container">
        {this.state.allContent.length !== 0 &&
          this.state.allContent.map((content, i) => {
            return(
              <div id={`content-${i}`} className="content-container">
                <svg className="arrow" id={`arrow-${i}`} viewBox="0 0 512 512"  xmlns="http://www.w3.org/2000/svg"><path d="M98.9,184.7l1.8,2.1l136,156.5c4.6,5.3,11.5,8.6,19.2,8.6c7.7,0,14.6-3.4,19.2-8.6L411,187.1l2.3-2.6  c1.7-2.5,2.7-5.5,2.7-8.7c0-8.7-7.4-15.8-16.6-15.8v0H112.6v0c-9.2,0-16.6,7.1-16.6,15.8C96,179.1,97.1,182.2,98.9,184.7z"/></svg>
                <h5 onClick={() => handleCollapseExpand(i)}>{content.name}</h5>
                <svg onClick={() => toggleMenu(i, true)} className="dots" viewBox="0 0 192 512" width="1em" height="1em"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z"></path></svg>
                <ul className="dots-options" id={`dots-options-${i}`} onMouseLeave={() => toggleMenu(i, false)}>
                  <li>Nach Oben</li>
                  <li>Nach Unten</li>
                  <li style={{color: 'red'}} onClick={() => deleteContent(i, content.id)}>Löschen</li>
                </ul>
                <div className="content-fields" id={`content-fields-${i}`}>
                  {
                    content.fields.map(field => {
                        return(createFields(content.id, field))
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="modelContainer" style={{marginTop: '100px'}}>
          <ul className="modelChoose" onMouseLeave={() => showModelMenu(false)}>
            {
              modularBlocksArray.map(modularBlock => {
                return(
                  <li onClick={(e) => handleOptionSelected(e.target.value)} value={modularBlock.trim()}>{plugin.itemTypes[modularBlock.trim()].attributes.name}</li>
                )
              })
            }
          </ul>
          <div className="modelChooseBtn" onClick={() => showModelMenu(true)}>
            <svg viewBox="0 0 448 512" width="1em" height="1em"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
            <p>Neu anlegen...</p>
          </div>
      </div>
      </>
    )
  }
}

