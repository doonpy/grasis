import { makeStyles } from '@material-ui/core/styles';
import AddAlert from '@material-ui/icons/AddAlert';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Card from '../../../../components/Card/Card';
import CardFooter from '../../../../components/Card/CardFooter';
import CardHeader from '../../../../components/Card/CardHeader';
import Button from '../../../../components/CustomButtons/Button';
import GridContainer from '../../../../components/Grid/GridContainer';
import GridItem from '../../../../components/Grid/GridItem';
import Snackbar from '../../../../components/Snackbar/Snackbar';
import withAuth from '../../../../hooks/withAuth';
import Admin from '../../../../layouts/Main-delete';
import { deleteLecturer } from '../../../../services/lecturer/lecturer.service';

const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0'
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none'
  }
};
const useStyles = makeStyles(styles);

const CancelButton = React.forwardRef(({ onClick, href }, ref) => {
  return (
    <a href={href} ref={ref} onClick={onClick}>
      <Button color="primary">Hủy bỏ</Button>
    </a>
  );
});

function Delete() {
  const classes = useStyles();
  const router = useRouter();
  const [notify, setNotify] = useState({ open: false, color: 'danger', message: '' });
  const handleSnackbarClose = () => {
    setNotify({ ...notify, open: false });
  };
  const handleSubmit = async () => {
    const res = await deleteLecturer(router.query.id);
    if (res.message) {
      setNotify({ open: true, color: 'danger', message: res.message });
      return;
    }
    setNotify({ open: true, color: 'success', message: 'Xóa giảng viên thành công.' });
    await router.replace('/admin/lecturer');
  };

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
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="danger">
              <h4 className={classes.cardTitleWhite}>Bạn có chắc chắn muốn xóa giảng viên này?</h4>
              <p className={classes.cardCategoryWhite}>Thao tác này không thể phục hồi</p>
            </CardHeader>
            <CardFooter>
              <Button color="danger" onClick={handleSubmit}>
                Xác nhận
              </Button>
              <Link href={`/admin/lecturer/${router.query.id}`}>
                <CancelButton />
              </Link>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

Delete.layout = Admin;
Delete.getInitialProps = async () => {
  return {
    title: 'Giảng viên',
    pageName: 'Xóa giảng viên'
  };
};

export default withAuth(Delete);
