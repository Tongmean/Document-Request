// // import React,{useState} from 'react';
// // import { Modal, Form, Input, Select, Button, message, Spin } from 'antd';
// // import { Usefetch } from '../../../๊Ultility/new/Usefetch';
// // import {postdrawingResponse} from '../../../๊Ultility/new/responseApi';
// // export default function ResponseFormModal({ responseOpen, request_no, onClose, onSuccess }) {
// //     const [form] = Form.useForm();
// //     const [loadingpage, setLoading] = useState(false);

// //     const { data: usersOption, loading: userLoading } = Usefetch("/user");
// //     // console.log("User data in responseOpen:", responseOpen);
// //     // const { data: statusList, loading: statusLoading } = useFetch("/status");  console.log("User data in ResponseFormModal:", useDate);
// //   const handleSubmit = async (values) => {
// //     const payload = {
// //       request_no: request_no,                  // ✅ key from parent
// //       assign_to_proccessor: values.processor,
// //       assign_to_approver: values.approver,
// //       response_status: values.response_status,
// //       response_by: values.response_by,
// //       response_at: new Date(),                  // or backend handle
// //     };

// //     try {
// //         setLoading(true);
// //         const result = await postdrawingResponse(payload);
// //         // console.log('Submitting payload:', payload);
// //         message.success(result?.msg);
// //         form.resetFields();
// //         onClose();
// //         onSuccess();   // ✅ call parent load()
// //     } catch (err) {
// //       message.error(err.msg || 'Submission failed');
// //     }finally{
// //         setLoading(false);
// //     }
// //   };
// //   const loading = userLoading || loadingpage;
// //   if (loading) return <Spin />;
// //   return (
// //     <Modal
// //       title={`Response Form : ${request_no}`}
// //       open={responseOpen}
// //       onCancel={onClose}
// //       footer={null}
// //     >
// //       <Form layout="vertical" form={form} onFinish={handleSubmit}
// //         initialValues={{
// //             response_status: "2",   // ✅ default value
// //         }}
// //       >
// //         <Form.Item
// //           label="Assign to Processor"
// //           name="processor"
// //           searchable
// //           rules={[{ required: true }]}
// //         >
// //           <Select
// //             options={usersOption?.map(u => ({
// //               value: u.user_id,
// //               label: u.email
// //             }))}
// //           />
// //         </Form.Item>

// //         <Form.Item
// //           label="Assign to Approver"
// //           name="approver"
// //           searchable
// //           rules={[{ required: true }]}
// //         >
// //           <Select
// //             options={usersOption?.map(u => ({
// //               value: u.user_id,
// //               label: u.email
// //             }))}
// //           />
// //         </Form.Item>

// //         <Form.Item
// //           label="Response Status"
// //           name="response_status"
// //           rules={[{ required: true }]}
// //           disabled                
// //         >
// //           <Select
// //             options={[
// //               { value: '2', label: 'Accepted' }
// //             ]}
// //           />
// //         </Form.Item>
// //         <Form.Item>
// //           <Button type="primary" htmlType="submit" block>
// //             Submit Response
// //           </Button>
// //         </Form.Item>
// //       </Form>
// //     </Modal>
// //   );
// // }
// import React, { useEffect, useState } from 'react';
// import { Modal, Form, Input, Select, Button, message, Spin, DatePicker, Space } from 'antd';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';

// import { Usefetch } from '../../../๊Ultility/new/Usefetch';
// import { postdrawingResponse } from '../../../๊Ultility/new/responseApi';
// import { fetchRequestdateItems } from '../../../๊Ultility/new/requestApi'; // 👈 your API

// export default function ResponseFormModal({
//   responseOpen,
//   request_no,
//   onClose,
//   onSuccess
// }) {
//   const [form] = Form.useForm();
//   const [loadingpage, setLoading] = useState(false);

//   const { data: usersOption, loading: userLoading } = Usefetch('/user');
//   const [requestDateItems, setRequestDateItems] = useState([]);

//   /* ------------------ Load request date items ------------------ */
//   useEffect(() => {
//     if (!responseOpen) return;

//     const load = async () => {
//       try {
//         setLoading(true);
//         const res = await fetchRequestdateItems({request_no: request_no});
//         console.log('Fetched request date items:', res);
//         const items = res?.data || [];

//         setRequestDateItems(items);

//         // map API → Form.List
//         form.setFieldsValue({
//           requestDateitems: items.map(i => ({
//             id: i.id,
//             expected_date: i.request_date ? dayjs(i.request_date) : null
//           }))
//         });
//       } catch (err) {
//         message.error('Failed to load request date items');
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [responseOpen, request_no]);

//   /* ------------------ Submit ------------------ */
//   const handleSubmit = async (values) => {
//     const payload = {
//       request_no,
//       assign_to_proccessor: values.processor,
//       assign_to_approver: values.approver,
//       response_status: values.response_status,
//       response_by: values.response_by,
//       response_at: new Date(),

//       // ✅ important part
//       requestDateitems: values.requestDateitems.map(i => ({
//         id: i.id,
//         expected_date: i.expected_date
//           ? i.expected_date.format('YYYY-MM-DD')
//           : null
//       }))
//     };

//     try {
//       setLoading(true);
//       const result = await postdrawingResponse(payload);
//       message.success(result?.msg || 'Submitted');
//       form.resetFields();
//       onClose();
//       onSuccess();
//     } catch (err) {
//       message.error(err.msg || 'Submission failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loading = userLoading || loadingpage;
//   if (loading) return <Spin />;

//   return (
//     <Modal
//       title={`Response Form : ${request_no}`}
//       open={responseOpen}
//       onCancel={onClose}
//       footer={null}
//       width={700}
//     >
//       <Form
//         layout="vertical"
//         form={form}
//         onFinish={handleSubmit}
//         initialValues={{
//           response_status: '2'
//         }}
//       >
//         {/* ---------------- Assignments ---------------- */}
//         <Form.Item label="Assign to Processor" name="processor" rules={[{ required: true }]}>
//           <Select
//             options={usersOption?.map(u => ({
//               value: u.user_id,
//               label: u.email
//             }))}
//           />
//         </Form.Item>

//         <Form.Item label="Assign to Approver" name="approver" rules={[{ required: true }]}>
//           <Select
//             options={usersOption?.map(u => ({
//               value: u.user_id,
//               label: u.email
//             }))}
//           />
//         </Form.Item>

//         <Form.Item label="Response Status" name="response_status">
//           <Select
//             disabled
//             options={[{ value: '2', label: 'Accepted' }]}
//           />
//         </Form.Item>

//         {/* ---------------- Request Date Items ---------------- */}
//         <Form.Item label="Request Date Items">
//           <Form.List name="requestDateitems">
//             {(fields, { add, remove }) => (
//               <>
//                 {fields.map(({ key, name, ...restField }) => (
//                   <Space key={key} align="baseline" style={{ display: 'flex' }}>
//                     {/* hidden id */}
//                     <Form.Item {...restField} name={[name, 'id']} hidden>
//                       <Input />
//                     </Form.Item>

//                     <Form.Item
//                       {...restField}
//                       label="Expected Date"
//                       name={[name, 'expected_date']}
//                       rules={[{ required: true, message: 'Select date' }]}
//                     >
//                       <DatePicker />
//                     </Form.Item>

//                     <MinusCircleOutlined onClick={() => remove(name)} />
//                   </Space>
//                 ))}

//                 <Button
//                   type="dashed"
//                   onClick={() => add({ id: null, expected_date: null })}
//                   block
//                   icon={<PlusOutlined />}
//                 >
//                   Add Date Item
//                 </Button>
//               </>
//             )}
//           </Form.List>
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" block>
//             Submit Response
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// }
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Spin,
  DatePicker,
  Space
} from 'antd';
import dayjs from 'dayjs';

import { Usefetch } from '../../../๊Ultility/new/Usefetch';
import { postdrawingResponse } from '../../../๊Ultility/new/responseApi';
import { fetchRequestdateItems } from '../../../๊Ultility/new/requestApi';

export default function ResponseFormModal({
  responseOpen,
  request_no,
  onClose,
  onSuccess
}) {
  const [form] = Form.useForm();
  const [loadingpage, setLoading] = useState(false);

  /* ------------------ Users ------------------ */
  const { data: usersOption, loading: userLoading } = Usefetch('/user');

  /* ------------------ Load request date items ------------------ */
  useEffect(() => {
    if (!responseOpen || !request_no) return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchRequestdateItems({request_no: request_no});
        const items = res?.data || [];
        console.log('Fetched request date items:', items);
        form.setFieldsValue({
          requestDateitems: items.map(i => ({
            id: i.id,
            request_date: i.request_date
              ? dayjs(i.request_date).format('YYYY-MM-DD')
              : '',
            expected_date: null
          }))
        });
      } catch (err) {
        message.error('Failed to load request date items');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [responseOpen, request_no]);

  /* ------------------ Submit ------------------ */
  const handleSubmit = async (values) => {
    const payload = {
      request_no,
      assign_to_proccessor: values.processor,
      assign_to_approver: values.approver,
      response_status: values.response_status,
      response_by: values.response_by,
      response_at: new Date(),

      // ✅ important
      requestDateitems: values.requestDateitems.map(i => ({
        id: i.id,
        expected_date: i.expected_date
          ? i.expected_date.format('YYYY-MM-DD')
          : null
      }))
    };

    try {
      setLoading(true);
      console.log('Submitting payload:', payload);
      const result = await postdrawingResponse(payload);
      message.success(result?.msg || 'Submitted successfully');
      form.resetFields();
      onClose();
      onSuccess();
    } catch (err) {
      message.error(err.msg || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const loading = userLoading || loadingpage;
  if (loading) return <Spin />;

  return (
    <Modal
      title={`Response Form : ${request_no}`}
      open={responseOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          response_status: '2'
        }}
      >
        {/* ---------------- Assign to Processor ---------------- */}
        <Form.Item
          label="Assign to Processor"
          name="processor"
          rules={[{ required: true }]}
        >
          <Select
            options={usersOption?.map(u => ({
              value: u.user_id,
              label: u.email
            }))}
          />
        </Form.Item>

        {/* ---------------- Assign to Approver ---------------- */}
        <Form.Item
          label="Assign to Approver"
          name="approver"
          rules={[{ required: true }]}
        >
          <Select
            options={usersOption?.map(u => ({
              value: u.user_id,
              label: u.email
            }))}
          />
        </Form.Item>

        {/* ---------------- Response Status ---------------- */}
        <Form.Item label="Response Status" name="response_status">
          <Select
            disabled
            options={[{ value: '2', label: 'Accepted' }]}
          />
        </Form.Item>

        {/* ---------------- Request Date Items ---------------- */}
        <Form.Item label="Request Date Items">
          <Form.List name="requestDateitems">
            {(fields) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    align="baseline"
                    style={{ display: 'flex', marginBottom: 8 }}
                  >
                    {/* hidden id */}
                    <Form.Item {...restField} name={[name, 'id']} hidden>
                      <Input />
                    </Form.Item>

                    {/* request_date (read only) */}
                    <Form.Item
                      {...restField}
                      label="Request Date"
                      name={[name, 'request_date']}
                    >
                      <Input disabled />
                    </Form.Item>

                    {/* expected_date (editable) */}
                    <Form.Item
                      {...restField}
                      label="Expected Date"
                      name={[name, 'expected_date']}
                      rules={[
                        { required: true, message: 'Please select expected date' }
                      ]}
                    >
                      <DatePicker />
                    </Form.Item>
                  </Space>
                ))}
              </>
            )}
          </Form.List>
        </Form.Item>

        {/* ---------------- Submit ---------------- */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit Response
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
