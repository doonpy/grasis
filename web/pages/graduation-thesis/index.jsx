import withAuth from '../../hoc/withAuth';
import Main from '../../layouts/Main';
import { SidebarKey } from '../../module/resource/sidebar';

function Index() {
  return <div>Implementing...</div>;
}

Index.layout = Main;

Index.getInitialProps = async (ctx) => {
  return {
    title: 'Danh sách khóa luận',
    selectedMenu: SidebarKey.GRADUATION_THESIS,
    breadcrumbs: [{ text: 'Danh sách khóa luận', href: ctx.asPath }]
  };
};

export default withAuth(Index);
