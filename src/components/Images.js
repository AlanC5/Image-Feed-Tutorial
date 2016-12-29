import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import sha1 from 'sha1'
import superagent from 'superagent'

class Images extends Component {

    constructor() {
        super()
        this.state = {
            images: []
        }
    }

    uploadFile(files) {
        console.log('uploadFiles: ')
        const image = files[0]

        // Use your own cloudName
        const cloudName = '<cloudName>'
        const url = 'https://api.cloudinary.com/v1_1/'+cloudName+'/image/upload'

        // Use your own uploadPreset
        const timestamp = Date.now()/1000
        const uploadPreset = '<uploadPreset>'

        // Use your own secret key
        const paramsStr = 'timestamp='+timestamp+'&upload_preset='+uploadPreset+'<secret_key>'

        // Use your own api key
        const signature = sha1(paramsStr)
        const params = {
            'api_key' : '<api key>',
            'timestamp': timestamp,
            'upload_preset' : uploadPreset,
            'signature' : signature
        }

        let uploadRequest = superagent.post(url)
        uploadRequest.attach('file', image)

        Object.keys(params).forEach((key) => {
            uploadRequest.field(key, params[key])
        })

        uploadRequest.end((err, res) => {
            if (err) {
                alert(err, null)
                return
            }

            console.log('UPLOAD COMPLETE: ' +JSON.stringify(res.body))
            const uploaded = res.body

            let updatedImages = Object.assign([], this.state.images)
            updatedImages.push(uploaded)

            this.setState({
                images: updatedImages
            })

        })
    }

    removeImage(event) {
        event.preventDefault()
        console.log('removeImage: ' + event.target.id)

        let updatedImages = Object.assign([], this.state.images)
        if (event.target.id > -1) {
            updatedImages.splice(event.target.id, 1);
        }

        this.setState({
            images:updatedImages
        })
    }

    render() {
        const list = this.state.images.map((image, i) => {
            return (
                <li key={i}>
                    <img src={image.secure_url} style={{width:72}}/>
                    <a id={i} href="#" onClick={this.removeImage.bind(this)}>Remove</a>
                </li>
            )
        })

        return (
            <div>
                Images Component
                <Dropzone onDrop={this.uploadFile.bind(this)}/>

                <ol>
                    { list }
                </ol>
            </div>
        )
    }
}

export default Images
