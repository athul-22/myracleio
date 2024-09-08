import React, { useEffect, useState } from 'react';
import { Layout, Input, Modal, Upload, Button, message, Skeleton } from 'antd';
import { PlusOutlined, CloseOutlined, RobotOutlined } from '@ant-design/icons';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; 

const { Sider, Content } = Layout;

const App = () => {

  useEffect(() => { 
    setIsTitleModalVisible(true)
  }, []);

  const [images, setImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isTitleModelVisible, setIsTitleModalVisible] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');

  const [isPromptDialogVisible, setIsPromptDialogVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleUpload = ({ fileList }) => {
    setImages(fileList.map(file => file.originFileObj)); 
    setIsModalVisible(false);
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const promptTemplates = [
    'Generate testing instructions based on the screenshot to verify the login functionality of the app.',
    'Create detailed testing steps for the registration feature, including error handling based on the provided screenshots.'
  ];

  const openPromptDialog = () => {
    setIsPromptDialogVisible(true);
  };

  const closePromptDialog = () => {
    setIsPromptDialogVisible(false);
  };

  const insertPromptIntoInput = (prompt) => {
    setInputValue(prompt);
    closePromptDialog();
  };

  const generateTestCase = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('prompt', inputValue);

    images.forEach((image) => {
      formData.append('images', image); 
    });

    try {
      const response = await axios.post('http://localhost:8000/gen', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Test case generated successfully!');
      setResponseMessage(response.data.response); 
      setInputValue(''); 
    } catch (error) {
      message.error('Failed to generate test case.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ height: '80vh', margin: '100px' }}>
      
      <Layout style={{ padding: '24px', background: '#fff', width: '100%' }}>
        <Content style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
          {projectTitle && 
          <h1
          style={{
            fontSize: '6rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #3D1DFF, #6147FF, #D451FF, #EC458D, #FFCA8B)', // Gradient background
            WebkitBackgroundClip: 'text', 
            backgroundClip: 'text',
            color: 'transparent', 
            marginBottom: '0.25rem', 
            zIndex: 10, 
            marginTop:'-50px'
          }}
        >
          {projectTitle}
        </h1>
         
          }
          {loading && (
            <>
              <div style={{ margin: '10px', width: '700px' }}>
                <Skeleton avatar active paragraph={{ rows: 4 }} />
                <div style={{ marginLeft: '50px', width: '700px' }}>
                  <Skeleton active paragraph={{ rows: 4 }} />
                  <Skeleton active paragraph={{ rows: 4 }} />
                 
                </div>
              </div>
            </>
          )}

          {responseMessage && (
            <div style={{ width: '700px', marginBottom: '20px' ,overflow:'scroll'}}>
              <ReactMarkdown>{responseMessage}</ReactMarkdown>
            </div>
          )}
         
          <Modal
            visible={isPromptDialogVisible}
            footer={null}
            onCancel={closePromptDialog}
            centered
            title="Select a Prompt"
            width={{ xs: '100%', sm: '50%' }}
          >
            {promptTemplates.map((template, index) => (
              <Button key={index} style={{ display: 'block', marginBottom: '8px', width: '100%' }} onClick={() => insertPromptIntoInput(template)}>
                {template}
              </Button>
            ))}
          </Modal>
          <Input.Group compact style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50%' }}>
            <Button
              icon={<RobotOutlined />}
              type="default"
              onClick={openPromptDialog}
              style={{ height: '35px', borderRadius: '4px' }}
            >
              AI Prompts
            </Button>

            <div style={{ position: 'relative', flex: 1, marginRight: '0px' }}>
              <Input.TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                style={{ height: '35px', borderRadius: '4px', marginBottom: '0px', width: '700px' }}
              />
              <Button
                icon={<PlusOutlined />}
                type="text"
                onClick={() => setIsModalVisible(true)}
                style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', height: '35px', borderRadius: '4px' }}
              />
            </div>

            <Button
              type="primary"
              onClick={generateTestCase}
              loading={loading}
              style={{ height: '35px', borderRadius: '4px', marginLeft: '0px' }}
            >
              Submit
            </Button>
          </Input.Group>

         
          <Modal
            visible={isModalVisible}
            footer={null}
            onCancel={() => setIsModalVisible(false)}
            centered
            title="Upload Images"
          >
            <Upload.Dragger
              name="file"
              multiple={true}
              beforeUpload={() => false}
              onChange={handleUpload}
              showUploadList={false}
              style={{ border: '1px dashed #ccc', padding: '24px', textAlign: 'center' }}
            >
              <p>Click or drag files to this area to upload</p>
            </Upload.Dragger>
          </Modal>
        </Content>
      </Layout>

     
      <Sider width={300} style={{ background: '#fff', padding: '24px' }}>
        
        {images.length > 0 && <h3>Uploaded Images</h3>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {images.map((img, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={URL.createObjectURL(img)}
                alt={`Uploaded ${index}`}
                style={{ width: '100px', height: '100px', borderRadius: '8px' }}
              />
              <CloseOutlined
                onClick={() => removeImage(index)}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  fontSize: '12px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  padding: '2px',
                  cursor: 'pointer',
                }}
              />
            </div>
          ))}
        </div>

        <Modal
            visible={isTitleModelVisible}
            footer={null}
            onCancel={() => setIsTitleModalVisible(false)}
            centered
            title="Enter Project Title"
          >
            <Input placeholder="Enter Project Title" onChange={(e) => setProjectTitle(e.target.value)} />
            <Button type="primary" onClick={() =>setIsTitleModalVisible(false) } style={{ marginTop: '10px' }}>
              Add Project
            </Button>
          </Modal>
      </Sider>
    </Layout>
  );
};

export default App;