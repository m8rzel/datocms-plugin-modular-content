import React, { Component } from 'react';
import './style.sass';
<<<<<<< HEAD
import $ from 'jquery'  
import JoditEditor from "jodit-react";
=======
import $ from 'jquery';

>>>>>>> newContent
export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allContent: [],
      links: [],
      formattedContent: [],
    };
  }

  componentDidMount() {
    if (this.props.fieldValue !== null) {
      this.setState({ formattedContent: JSON.parse(this.props.fieldValue), links: [] }, () => {
        /* console.log("AllContent", this.state.allContent)
        const newFormattedContent = this.state.allContent.map(content => {
          const modelKey = content.api_key;
          const contentID = content.id;
          const modelName = content.name;
          const modelID = content.model_id;
          var fields = [];
          content.fields.map(field => {
            fields[field.api_key] = field.value;
          })
          return({'model_id' : modelID, 'api_key' : modelKey, 'id' : contentID, 'name' : modelName, 'fields' : fields })
        })
        this.setState({formattedContent: newFormattedContent})
        console.log("NewArray", newFormattedContent) */
        this.state.formattedContent.map((content) => {
          // console.log("Content Componentdidmount", content)
          const { plugin } = this.props;
          const fieldArray = plugin.itemTypes[content.model_id].relationships.fields.data;
          const contentName = content.name;
          const contentApiKey = content.api_key;
          const newFieldArray = fieldArray.map((field) => {
            if (field.type === 'field') {
              const fieldContent = plugin.fields[field.id].attributes;
              // console.log("Field", content.fields[fieldContent.api_key])
              return ({
                field_type: fieldContent.field_type, 
                label: fieldContent.label, api_key: fieldContent.api_key, 
                value: content.fields[fieldContent.api_key], 
                links: fieldContent.field_type === 'links' && fieldContent.validators.items_item_type.item_types,
                validators: fieldContent.field_type === 'string' && fieldContent.validators && fieldContent.validators.enum && fieldContent.validators.enum.values && fieldContent.validators.enum.values,
              });
            }
          });
          const newContent = this.state.allContent;
          newContent.push({
            model_id: content.model_id, id: content.id, name: contentName, fields: newFieldArray, api_key: contentApiKey,
          });
          this.setState({ allContent: newContent }, () => {
            // console.log("All Content", this.state.allContent)
          });
        });
      });
    }
  }

  render() {
    const { plugin, fieldValue, modularBlocks } = this.props;
    const modularBlocksArray = modularBlocks.split(',');
    const createFields = (id, fieldContent) => {
      if (fieldContent.field_type === 'string') {
        // console.log("Created text field", fieldContent)
        if(fieldContent.validators){
          return(
            <>
              <section className="label-key">
                <p className="label">{fieldContent.label}</p>
                <p className="apiKey">{fieldContent.api_key}</p>
              </section>
              <select name="ab" onChange={e => handleInputChange(id, e.target.value, fieldContent.api_key)} value={fieldContent.value}>
                  {fieldContent.validators.map(option => {
                    if(fieldContent.value === option){
                      return(<option selected value={option}>{option}</option>)
                    } else{
                      return(<option value={option}>{option}</option>)
                    }
                  })
                  }
              </select>
            </>
          );
        } else{
            return (
              <>
                <section className="label-key">
                  <p className="label">{fieldContent.label}</p>
                  <p className="apiKey">{fieldContent.api_key}</p>
                </section>
                <input onChange={e => handleInputChange(id, e.target.value, fieldContent.api_key)} value={fieldContent.value} className="default-input" type="text" placeholder={fieldContent.label} />
              </>
            );
        }
      }

      if (fieldContent.field_type === 'text') {
        return (
          <>
            <section className="label-key">
                  <p className="label">{fieldContent.label}</p>
                  <p className="apiKey">{fieldContent.api_key}</p>
              </section>
            <textarea onChange={e => handleInputChange(id, e.target.value, fieldContent.api_key)} value={fieldContent.value} className="default-input" placeholder={fieldContent.label} />
          </>
        );
      }
      if (fieldContent.field_type === 'file') {
        return (
          <>
            <section className="label-key">
              <p className="label">{fieldContent.label}</p>
              <p className="apiKey">{fieldContent.api_key}</p>
            </section>
            <div className="image-upload" onClick={() => selectUploadFile(id, fieldContent.api_key)}>
              {
                fieldContent.value === ''
                  ? <p>Mediendatei auswählen</p>
                  : <img src={fieldContent.value} />
              }
            </div>
          </>
        );
      }
      if (fieldContent.field_type === 'links') {
        // console.log("Field test", this.state.formattedContent)
        // console.log("Field test id", id)
        // console.log("Content ID", id)
        // console.log("Content", this.state.formattedContent)
        return (
          <>
            <section className="label-key">
                <p className="label">{fieldContent.label}</p>
                <p className="apiKey">{fieldContent.api_key}</p>
            </section>
            <ul className="input-links" onClick={() => selectLinks(id, fieldContent.api_key, fieldContent.links[0])}>
              {
                this.state.formattedContent.length > 0 && this.state.formattedContent[this.state.formattedContent.findIndex(content => content.id === id)].fields[fieldContent.api_key].map(link => (
                  <li>
                    <p onClick={() => editLinks(link.id)}>{link.displayName}</p>
                    <svg onClick={() => deleteLinks(id, fieldContent.api_key, fieldContent.links[0], link.id)} height="14" width="14" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-19bqh2r"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z" /></svg>
                  </li>
                ))
              }
            </ul>
          </>

        );
      }
    };
    const deleteLinks = (id, fieldAPIKey, currentItemId) => {
      $('.input-links li svg').on('click', (event) => {
        event.stopPropagation();
      });
      const newLinks = this.state.formattedContent[this.state.formattedContent.findIndex(content => content.id === id)].fields[fieldAPIKey];
      const currentIndex = newLinks.findIndex(content => content.id === currentItemId);
      newLinks.splice(currentIndex, 1);
      handleInputChange(id, newLinks, fieldAPIKey);
    };
    const editLinks = (id) => {
      plugin.editItem(id)
        .then((item) => {
          if (item) {
          // console.log('Item edited: ', item);
          // console.log("item click")
          } else {
          // console.log('Model closed!');
          }
        });
    };
    const handleLinks = (id, item, fieldAPIKey, displayName, itemId) => {
      const newLinks = this.state.formattedContent[this.state.formattedContent.findIndex(content => content.id === id)].fields[fieldAPIKey];
      // const newLinks = this.state.links;
      item.attributes.id = itemId;
      newLinks.push(item.attributes);
      // console.log("Newslinks", newLinks);
      // this.setState({links: newLinks}, () => {
      // console.log("links saved", this.state.links[0])
      const linkAttributes = newLinks.map((link, i) => {
        link.displayName = link.displayName ? link.displayName : displayName;
        return (link);
      });
      handleInputChange(id, linkAttributes, fieldAPIKey);
      // })
    };
    const selectLinks = (id, fieldAPIKey, contentID) => {
      // console.log("ID", contentID)
      plugin.selectItem(contentID)
        .then((item) => {
          if (item) {
            console.log('Item', item);
            const apiKey = plugin.fields[plugin.itemTypes[item.relationships.item_type.data.id].relationships.fields.data[0].id].attributes.api_key;
            item.displayName = item.attributes[apiKey];
            // console.log('Item selected: ', item);
            handleLinks(id, item, fieldAPIKey, item.attributes[apiKey], item.id);
          } else {
            // console.log('Modal closed!');
          }
        });
    };
    const setFieldValueJSON = (newContentArrayFormatted, newContent) => {
      this.setState({ formattedContent: newContentArrayFormatted, allContent: newContent }, () => {
        // console.log("FieldValue set", JSON.stringify(this.state.formattedContent))
        plugin.setFieldValue(plugin.fieldPath, JSON.stringify(this.state.formattedContent));
      });
    };
    const handleInputChange = (id, value, apiKey) => {
      const newFormattedContent = this.state.formattedContent;
      const newContentArray = this.state.allContent;
      const currentIndexFormatted = newFormattedContent.findIndex(content => content.id === id);
      const currentIndex = newContentArray.findIndex(content => content.id === id);
      const currentFieldIndex = newContentArray[currentIndex].fields.findIndex(field => field.api_key === apiKey);
      newContentArray[currentIndex].fields[currentFieldIndex].value = value;
      // console.log("ID", id)
      // console.log("CurrentIndex", newFormattedContent)
      newFormattedContent[currentIndexFormatted].fields[apiKey] = value;
      setFieldValueJSON(newFormattedContent, newContentArray);
    };
    const selectUploadFile = (id, apiKey) => {
      plugin.selectUpload()
        .then((upload) => {
          if (upload) {
            // console.log('Upload selected: ', upload);
            handleInputChange(id, upload.attributes.url, apiKey);
          } else {
            // console.log('Modal closed!');
          }
        });
    };
    const handleOptionSelected = (modelID) => {
      $('.modelChoose').css('display', 'none');
      const id = Date.now();
      const fieldArray = plugin.itemTypes[modelID].relationships.fields.data;
      const contentName = plugin.itemTypes[modelID].attributes.name;
      const contentApiKey = plugin.itemTypes[modelID].attributes.api_key;
      const newFormattedContent = this.state.formattedContent;
      const newFieldArray = fieldArray.map((field) => {
        if (field.type === 'field') {
          const fieldContent = plugin.fields[field.id].attributes;
          console.log("Field", fieldContent)
          return ({
            field_type: fieldContent.field_type, label: fieldContent.label, 
            api_key: fieldContent.api_key, 
            value: fieldContent.field_type === 'links' ? [] : (fieldContent.default_value ? fieldContent.default_value : ''), 
            links: fieldContent.field_type === 'links' && fieldContent.validators.items_item_type.item_types,
            validators: fieldContent.field_type === 'string' && fieldContent.validators && fieldContent.validators.enum && fieldContent.validators.enum.values && fieldContent.validators.enum.values,
          });
        }
      });
      // console.log("New Field array", newFieldArray);
      const newContent = this.state.allContent;
      newContent.push({
        model_id: modelID, id, name: contentName, fields: newFieldArray, api_key: contentApiKey,
      });
      // console.log("Neu Content", newContent);
      this.setState({ allContent: newContent }, () => {
        // console.log("entered")
        const fields = {};
        newFieldArray.map((field) => {
          // console.log("Field Key", field)
          fields[field.api_key] = field.field_type === 'links' ? [] : '';
        });
        newFormattedContent.push({
          model_id: modelID, api_key: contentApiKey, id, name: contentName, fields,
        });
        this.setState({ formattedContent: newFormattedContent }, () => {
          // console.log("Content", this.state.formattedContent)
        });
      });
      // console.log("Model Click", plugin.itemTypes[modelID].relationships.fields.data)
    };
    const handleCollapseExpand = (i) => {
      if ($(`#content-${i}`).height() !== 40) {
        $(`#content-${i}`).css('height', '40px');
        $(`#content-fields-${i}`).css('display', 'none');
        $(`#arrow-${i}`).css('transform', 'rotate(-90deg)');
      } else {
        $(`#content-${i}`).css('height', '100%');
        $(`#content-fields-${i}`).css('display', 'block');
        $(`#arrow-${i}`).css('transform', 'rotate(0deg)');
      }
    };
    const toggleMenu = (i, type) => {
      if (type === true) {
        $(`#dots-options-${i}`).css('display', 'block');
      } else {
        $(`#dots-options-${i}`).css('display', 'none');
      }
    };
    const deleteContent = (i, id) => {
      $(`#dots-options-${i}`).css('display', 'none');
      const contentArray = this.state.allContent;
      const currentIndex = contentArray.findIndex(content => content.id === id);
      contentArray.splice(currentIndex, 1);

      const contentArrayFormatted = this.state.formattedContent;
      const currentIndexFormatted = contentArrayFormatted.findIndex(content => content.id === id);
      contentArrayFormatted.splice(currentIndexFormatted, 1);
      // console.log("content delete", contentArrayFormatted)
      setFieldValueJSON(contentArrayFormatted, contentArray);
    };
    const showModelMenu = (type) => {
      if (type === true) {
        $('.modelChoose').css('display', 'block');
      } else {
        $('.modelChoose').css('display', 'none');
      }
    };
    return (
      <>
        <div className="container">
          {this.state.allContent.length !== 0 && this.state.allContent.length === this.state.formattedContent.length
          && this.state.allContent.map((content, i) => (
            <div id={`content-${i}`} className="content-container">
              <svg className="arrow" id={`arrow-${i}`} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M98.9,184.7l1.8,2.1l136,156.5c4.6,5.3,11.5,8.6,19.2,8.6c7.7,0,14.6-3.4,19.2-8.6L411,187.1l2.3-2.6  c1.7-2.5,2.7-5.5,2.7-8.7c0-8.7-7.4-15.8-16.6-15.8v0H112.6v0c-9.2,0-16.6,7.1-16.6,15.8C96,179.1,97.1,182.2,98.9,184.7z" /></svg>
              <h5 onClick={() => handleCollapseExpand(i)}>{content.name}</h5>
              <svg onClick={() => toggleMenu(i, true)} className="dots" viewBox="0 0 192 512" width="1em" height="1em"><path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z" /></svg>
              <ul className="dots-options" id={`dots-options-${i}`} onMouseLeave={() => toggleMenu(i, false)}>
                <li>Nach Oben</li>
                <li>Nach Unten</li>
                <li style={{ color: 'red' }} onClick={() => deleteContent(i, content.id)}>Löschen</li>
              </ul>
              <div className="content-fields" id={`content-fields-${i}`}>
                {
                    content.fields.map(field => (createFields(content.id, field)))
                  }
              </div>
            </div>
          ))
        }
        </div>
        <div className="modelContainer" style={{ marginTop: '100px' }}>
          <ul className="modelChoose" onMouseLeave={() => showModelMenu(false)}>
            {
              modularBlocksArray.map(modularBlock => (
                <li onClick={e => handleOptionSelected(e.target.value)} value={modularBlock.trim()}>{plugin.itemTypes[modularBlock.trim()].attributes.name}</li>
              ))
            }
          </ul>
          <div className="modelChooseBtn" onClick={() => showModelMenu(true)}>
            <svg viewBox="0 0 448 512" width="1em" height="1em"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" /></svg>
            <p>Neu anlegen...</p>
          </div>
        </div>
      </>
    );
  }
}
