import { Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import AddAlert from '@material-ui/icons/AddAlert';
import DescriptionIcon from '@material-ui/icons/Description';
import { Skeleton } from '@material-ui/lab';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Card from '../../../components/Card/Card';
import CardBody from '../../../components/Card/CardBody';
import CardFooter from '../../../components/Card/CardFooter';
import CardHeader from '../../../components/Card/CardHeader';
import RegularButton from '../../../components/CustomButtons/Button';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Snackbar from '../../../components/Snackbar/Snackbar';
import Table from '../../../components/Table/Table';
import { useFindAllForListLecturer } from '../../../hooks/lecturer.hook';
import withAuth from '../../../hooks/withAuth';
import Admin from '../../../layouts/Admin';
import { formatUserDetailForList } from '../../../services/user.service';

const styles = {
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0'
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF'
    }
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1'
    }
  }
};

const useStyles = makeStyles(styles);

function Index() {
  const router = useRouter();
  const classes = useStyles();
  const [notify, setNotify] = useState({ open: false, color: 'danger', message: '' });
  const [pageNumber, setPageNumber] = useState(0);

  const handleSnackbarClose = () => {
    setNotify({ ...notify, open: false });
  };
  let lecturers = [];
  const { data, isLoading } = useFindAllForListLecturer(pageNumber);

  if (!isLoading && !data.error) {
    lecturers = data.lecturers;
  }

  useEffect(() => {
    console.log(data);
    if (data.error) {
      setNotify({ open: true, color: 'danger', message: data.message });
    }
  }, [data]);

  return (
    <div>
      <Snackbar
        place="tc"
        color={notify.color}
        icon={AddAlert}
        message={notify.message}
        open={notify.open}
        closeNotification={handleSnackbarClose}
        close
      />
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          {isLoading ? (
            <Skeleton variant="rect" height={300} />
          ) : (
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Danh sách giảng viên</h4>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={[
                    '',
                    'Mã giảng viên',
                    'Chức vụ',
                    'Tên người dùng',
                    'Họ và tên',
                    'Giới tính',
                    'Trạng thái'
                  ]}
                  tableData={lecturers.map((lecturer, index) => [
                    <Link key={index} href={`${router.pathname}/${lecturer.id}`}>
                      <IconButton key={index} color="primary" aria-label="Chi tiết giảng viên">
                        <DescriptionIcon />
                      </IconButton>
                    </Link>,
                    lecturer.lecturerId || 'null',
                    lecturer.position ? lecturer.position.title : 'null',
                    ...formatUserDetailForList(lecturer.userDetail)
                  ])}
                />
              </CardBody>
              <CardFooter>
                <RegularButton
                  color="primary"
                  disabled={pageNumber === 0}
                  onClick={() => setPageNumber(pageNumber - 1)}>
                  Quay lại
                </RegularButton>
                <RegularButton
                  disabled={!data.isNext}
                  color="primary"
                  onClick={() => setPageNumber(pageNumber + 1)}>
                  Tiếp theo
                </RegularButton>
              </CardFooter>
            </Card>
          )}
        </GridItem>
      </GridContainer>
    </div>
  );
}

Index.layout = Admin;

Index.getInitialProps = async () => {
  return {
    title: 'Giảng viên',
    breadCrumb: [{ name: 'Giảng viên', path: '/admin/lecturer' }]
  };
};

export default withAuth(Index);
