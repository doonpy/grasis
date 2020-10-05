import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';
import { FiberManualRecord } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import avatar from '../../../../assets/img/faces/marc.jpg';
import lecturerDetailStyle from '../../../../assets/jss/views/lecturer/lecturerDetailStyle';
import Card from '../../../../components/Card/Card';
import CardAvatar from '../../../../components/Card/CardAvatar';
import CardBody from '../../../../components/Card/CardBody';
import CardFooter from '../../../../components/Card/CardFooter';
import CardHeader from '../../../../components/Card/CardHeader';
import Button from '../../../../components/CustomButtons/Button';
import CustomInput from '../../../../components/CustomInput/CustomInput';
import GridContainer from '../../../../components/Grid/GridContainer';
import GridItem from '../../../../components/Grid/GridItem';
import { useFindOneLecturer } from '../../../../hooks/lecturer.hook';
import withAuth from '../../../../hooks/withAuth';
import Main from '../../../../layouts/Main-delete';
import { getLecturerPositionForView } from '../../../../services/lecturer-position.service';
import { getInitialLecturerState } from '../../../../services/lecturer/lecturer.service';
import { GENDER, USER_STATUS } from '../../../../services/user.service';

const useStyles = makeStyles(lecturerDetailStyle);

function Edit({ setNotifyPopup }) {
  const classes = useStyles();
  const router = useRouter();
  const { data, isLoading } = useFindOneLecturer(router.query.id);
  const [lecturer, setLecturer] = useState(getInitialLecturerState());

  useEffect(() => {
    if (data && data.error) {
      setNotifyPopup({ open: true, color: 'danger', message: data.message });
      return;
    }

    if (!isLoading && data) {
      setLecturer(data.lecturer);
    }
  }, [data]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Thông tin giảng viên</h4>
              {/*<p className={classes.cardCategoryWhite}></p>*/}
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={2}>
                  <CustomInput
                    labelText="Mã giảng viên"
                    id="id"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true,
                      value: lecturer.lecturerId || 'NULL'
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="Họ và tên đệm"
                    id="lastname"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true,
                      value: lecturer.userDetail.lastname || 'NULL'
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="Tên"
                    id="firstname"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true,
                      value: lecturer.userDetail.firstname || 'NULL'
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Chức vụ"
                    id="position"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true,
                      value: getLecturerPositionForView(lecturer.position)
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Trình độ"
                    id="level"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true,
                      value: lecturer.level || 'NULL'
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Tên người dùng"
                    id="username"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true,
                      value: lecturer.userDetail.username || 'NULL'
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Email"
                    id="email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true,
                      value: lecturer.userDetail.email || 'NULL'
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Điện thoại"
                    id="phone"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true,
                      value: lecturer.userDetail.phone || 'NULL'
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Địa chỉ"
                    id="address"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true,
                      value: lecturer.userDetail.address || 'NULL'
                    }}
                  />
                </GridItem>
              </GridContainer>
              <br />
              <GridContainer>
                {/*<GridItem xs={12} sm={12} md={6}>*/}
                {/*  <InputLabel style={{ color: '#AAAAAA' }}>Giới tính</InputLabel>*/}
                {/*  <FormControlLabel*/}
                {/*    control={*/}
                {/*      <Radio*/}
                {/*        checked={lecturer.userDetail.gender === GENDER.MALE}*/}
                {/*        value={GENDER.MALE}*/}
                {/*        name="gender"*/}
                {/*        aria-label="gender"*/}
                {/*        icon={<FiberManualRecord className={classes.radioUnchecked} />}*/}
                {/*        checkedIcon={<FiberManualRecord className={classes.radioChecked} />}*/}
                {/*        classes={{ radio: classes.radio }}*/}
                {/*      />*/}
                {/*    }*/}
                {/*    classes={{ label: classes.label }}*/}
                {/*    label="Nam"*/}
                {/*  />*/}
                {/*  <FormControlLabel*/}
                {/*    control={*/}
                {/*      <Radio*/}
                {/*        checked={lecturer.userDetail.gender === GENDER.FEMALE}*/}
                {/*        value={GENDER.FEMALE}*/}
                {/*        name="gender"*/}
                {/*        aria-label="gender"*/}
                {/*        icon={<FiberManualRecord className={classes.radioUnchecked} />}*/}
                {/*        checkedIcon={<FiberManualRecord className={classes.radioChecked} />}*/}
                {/*        classes={{ radio: classes.radio }}*/}
                {/*      />*/}
                {/*    }*/}
                {/*    classes={{ label: classes.label }}*/}
                {/*    label="Nữ"*/}
                {/*  />*/}
                {/*</GridItem>*/}
                {/*<GridItem xs={12} sm={12} md={6}>*/}
                {/*  <InputLabel style={{ color: '#AAAAAA' }}>Trạng thái</InputLabel>*/}
                {/*  <FormControlLabel*/}
                {/*    control={*/}
                {/*      <Radio*/}
                {/*        checked={lecturer.userDetail.status === USER_STATUS.ACTIVE}*/}
                {/*        value={USER_STATUS.ACTIVE}*/}
                {/*        name="status"*/}
                {/*        aria-label="status"*/}
                {/*        icon={<FiberManualRecord className={classes.radioUnchecked} />}*/}
                {/*        checkedIcon={<FiberManualRecord className={classes.radioChecked} />}*/}
                {/*        classes={{ radio: classes.radio }}*/}
                {/*      />*/}
                {/*    }*/}
                {/*    classes={{ label: classes.label }}*/}
                {/*    label="Đang hoạt động"*/}
                {/*  />*/}
                {/*  <FormControlLabel*/}
                {/*    control={*/}
                {/*      <Radio*/}
                {/*        checked={lecturer.userDetail.gender === USER_STATUS.IN_ACTIVE}*/}
                {/*        value={USER_STATUS.IN_ACTIVE}*/}
                {/*        name="status"*/}
                {/*        aria-label="status"*/}
                {/*        icon={<FiberManualRecord className={classes.radioUnchecked} />}*/}
                {/*        checkedIcon={<FiberManualRecord className={classes.radioChecked} />}*/}
                {/*        classes={{ radio: classes.radio }}*/}
                {/*      />*/}
                {/*    }*/}
                {/*    classes={{ label: classes.label }}*/}
                {/*    label="Ngưng hoạt động"*/}
                {/*  />*/}
                {/*</GridItem>*/}
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary">Update Profile</Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>CEO / CO-FOUNDER</h6>
              <h4 className={classes.cardTitle}>Alec Thompson</h4>
              <p className={classes.description}>
                Don{"'"}t be scared of the truth because we need to restart the human foundation in
                truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the
                back is...
              </p>
              <Button color="primary" round>
                Follow
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

Edit.layout = Main;
Edit.getInitialProps = async () => {
  return {
    title: 'Giảng viên',
    pageName: 'Chỉnh sửa thông tin giảng viên'
  };
};

export default withAuth(Edit);
